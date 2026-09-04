# The globe that kept warning us: a MapLibre GPU readback story

*A field note from upgrading our globe-projection basemaps to MapLibre GL JS v6.*

## The warning that wouldn't stop

While working on our `dark-blue` basemap — one of our globe-projection styles — we started noticing the console fill up with the same message, over and over, dozens of times a minute:

```
performance warning: READ-usage buffer was written, then fenced, but written again before being read back.
This discarded the shadow copy that was created to accelerate readback.
    at _renderErrorTexture (globe_projection_error_measurement.ts:184)
    at updateErrorLoop (globe_projection_error_measurement.ts:144)
    at updateGPUdependent (vertical_perspective_projection.ts:104)
    at updateGPUdependent (globe_projection.ts:112)
    at render (painter.ts:544)
```

It wasn't an error. Nothing was visibly broken — the globe still rendered, still spun, still looked right. But it fired on basically every animation frame, which made it impossible to ignore and impossible to work around by just "not looking at the console." Something inside MapLibre's rendering loop was hitting this path continuously, and we wanted to understand why before deciding whether to patch around it or just live with the noise.

## First instinct: is this our bug?

Our first assumption was that we'd done something wrong — maybe a custom layer, maybe the starfield background script we render behind the globe, maybe some interaction between our PMTiles source and the globe projection's render loop. That turned out to be a dead end almost immediately: the stack trace pointed entirely at MapLibre's own internals. `globe_projection_error_measurement.ts` isn't part of our codebase at all — it lives inside `node_modules/maplibre-gl/src/geo/projection/`. Whatever was happening, it was happening *inside* the library, on every map using globe projection, regardless of what we'd built on top of it.

That reframed the question: not "what did we break," but "what is this internal mechanism doing, and why does it look unhappy."

## What `ProjectionErrorMeasurement` is actually for

Globe projection has a subtle math problem. To bend a flat Mercator-projected map around a sphere, MapLibre's vertex shader has to convert Mercator Y coordinates into angular coordinates using inverse trigonometry — an `atan(exp(...))` calculation. On most GPUs that's fine. On some GPUs (the code comments specifically call out AMD, Nvidia, and later Mali), that calculation loses enough floating-point precision that the map visibly shifts north-south by up to a few hundred meters at certain latitudes. Not a rendering glitch you'd notice from a screenshot, but the kind of error that shows up as "why is this landmark not quite where it should be."

Because the size of that error is hardware-dependent and can't be predicted ahead of time, MapLibre's globe projection measured it *at runtime*, every few frames, using a clever but fairly elaborate GPU dance:

1. Render a tiny 1x1 pixel "error texture" using a shader that computes the same angular projection the main globe shader uses, for the current center latitude.
2. Kick off an asynchronous readback of that single pixel using a WebGL2 **Pixel Pack Buffer (PBO)** — a GPU buffer that lets you queue up a `readPixels` call without blocking the CPU while the GPU finishes the work.
3. Place a *fence* (`gl.fenceSync`) so MapLibre can later check "has the GPU actually finished writing this yet?" without stalling the pipeline waiting for it.
4. A few frames later, check whether the fence has signaled, and if so, pull the measured error value back out of the PBO with `gl.getBufferSubData`.
5. Use that measured error to nudge the globe's projection matrix, correcting the drift.
6. Wait several more frames, then repeat the whole loop.

This is a legitimate, if intricate, GPU optimization technique: PBOs exist specifically so you can avoid stalling the render pipeline on synchronous pixel readbacks. The "shadow copy" the warning refers to is the browser/driver's own bookkeeping — an accelerated path it sets up so that when you eventually read the buffer back, it doesn't have to block on the GPU.

## Why the warning fired

The warning is the browser telling you that this accelerated path got invalidated: the *same* PBO was written to again by a new draw call before the previous fenced read had actually been consumed. When that happens, the driver can't safely hand you the "shadow copy" it prepared (it might not reflect the latest write), so it throws that copy away and falls back to a slower, more defensive readback path.

In practice, `ProjectionErrorMeasurement` reuses a single PBO object (`this._pbo`) across every measurement cycle for the lifetime of the class. Its own internal timing (`_readbackWaitFrames = 4`, `_measureWaitFrames = 6`) is designed to avoid exactly this collision, by spacing out writes and reads. But depending on the browser's WebGL implementation, the driver, and how the browser's own scheduling interacts with `requestAnimationFrame`, that spacing isn't always enough to prevent the buffer being re-armed before the prior read is fully drained — hence the warning firing repeatedly during continuous rendering (our globe was rotating, so the render loop and this loop ran on essentially every frame).

Nothing about this was silently *wrong* in the sense of corrupting output — worst case, a measurement gets discarded and re-attempted, and the projection correction lags a few extra frames. But it's a real, measurable performance cost paid on every frame, for every globe map, indefinitely.

## The fix that wasn't ours to make

Once we knew the mechanism lived entirely inside MapLibre, the obvious next question was whether newer versions had touched it. They had — completely.

In [MapLibre GL JS v6.1.0](https://github.com/maplibre/maplibre-gl-js/releases/tag/v6.1.0), the team fixed the *underlying* precision problem instead of continuing to work around it at runtime:

> Fix globe latitude precision on some GPUs (e.g. Mali) by reformulating the mercator-to-sphere Y coordinate algebraically (`exp` + rational arithmetic instead of `atan`/`sin`/`cos`), avoiding float32 cancellation and imprecise hardware transcendentals near the equator; the runtime GPU `atan`-error measurement/correction this superseded has also been removed ([#7419](https://github.com/maplibre/maplibre-gl-js/issues/7419))

In other words: the reason the shader needed a `atan(exp(...))` inverse-trig calculation in the first place was itself the fixable part. By reformulating the math to avoid the imprecise transcendental functions near the equator, the projection is accurate enough on its own that it no longer needs a GPU-measured, PBO-readback-based runtime correction. The whole `ProjectionErrorMeasurement` class — the shader, the framebuffer, the PBO, the fence, the multi-frame wait loop — was deleted outright, not tuned or rate-limited.

That's a satisfying kind of fix: the warning wasn't papered over by, say, avoiding the readback path or debouncing the buffer reuse. The entire subsystem that was capable of producing the warning no longer exists in v6.1.0+. Upgrade past that version, and the warning has nothing left to come from.

## What upgrading actually involved

We were on `maplibre-gl@5.13.0`. Jumping to the current `6.7.0` (the latest as of this writing) meant more than a version bump in a `<script>` tag, because MapLibre GL JS v6 dropped its UMD build entirely and now ships ESM-only. Two real changes fell out of that:

1. **Module loading.** Our preview pages used a plain `<script src=".../maplibre-gl.js">` UMD include. That bundle doesn't exist for v6, so we switched to an inline module script that imports the `.mjs` build and attaches it to `window.maplibregl` for our existing non-module scripts to keep using:

    ```html
    <script type="module">
      import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.7.0/dist/maplibre-gl.mjs';
      window.maplibregl = maplibregl;
    </script>
    <script defer src="https://unpkg.com/pmtiles@4.3.0/dist/pmtiles.js"></script>
    <script defer src="/shared/js/maplibre-gl-starfield.js"></script>
    <script defer src="./map-config.js"></script>
    <script defer src="./map.js"></script>
    ```

    Module scripts execute after parsing but don't block on other `defer` scripts by spec ordering guarantees the same way classic scripts do, so everything that depends on `window.maplibregl` being set also needed `defer`, to preserve the load order we used to get "for free" with sequential UMD `<script>` tags. See [`basemaps/dark-blue/preview.html`](../basemaps/dark-blue/preview.html) for the final version we shipped.

2. **A removed private API.** Our starfield background effect ([`shared/js/maplibre-gl-starfield.js`](../shared/js/maplibre-gl-starfield.js)) sizes its glow effect off the map's current world size and center latitude, and had been reading those off `map._getTransformForUpdate()` — an internal, underscore-prefixed accessor that was never part of MapLibre's public API. In v6, `Map` no longer exposes its transform that way, and the call started throwing `TypeError: map._getTransformForUpdate is not a function`. The fix was to derive the same two numbers from public APIs instead, with a fallback for anyone still on v5:

    ```js
    if (typeof map._getTransformForUpdate === "function") {
      // MapLibre GL JS v5 and earlier expose this internal transform accessor.
      const transform = map._getTransformForUpdate();
      if (!transform) return 200;
      worldSize = transform.worldSize;
      lat = transform.center.lat;
    } else {
      // MapLibre GL JS v6+ removed the internal `_getTransformForUpdate()` accessor.
      // worldSize = tileSize * 2^zoom, using MapLibre's standard 512px tile size.
      worldSize = 512 * Math.pow(2, map.getZoom());
      lat = map.getCenter().lat;
    }
    ```

Neither of these was related to the GPU warning itself — they were just the price of admission for a major version upgrade. It's a good reminder that "upgrade to fix an internal warning" and "the upgrade is free" are two different claims; the warning fix was free, the migration work was not.

One more thing surfaced during this pass that turned out to be unrelated entirely: after upgrading, `dark-blue` appeared to have no place labels or POI icons, which looked like a regression. It wasn't — `basemaps/dark-blue/styles/theme.ts` had `placeLabels.enabled: false`, `pois.enabled: false`, and road label opacity set to `0.0`, independent of any MapLibre version. Comparing against `dark-gray`'s theme (which does show labels) and aligning the settings fixed it. Worth mentioning only because it's a good example of how easy it is to misattribute a pre-existing configuration choice to "the thing I just changed."

## Takeaways

- Console *warnings* are worth reading even when the map looks fine. A warning that fires once is noise; a warning that fires on every animation frame for the life of the map is a real, ongoing cost, and it's usually pointing at something specific enough to be worth 20 minutes of investigation.
- Sometimes the right fix genuinely is "upgrade the library," not "work around the library." Once we confirmed the warning's entire code path lived inside `node_modules`, there was no local workaround worth attempting — the fix belonged upstream, and MapLibre had already shipped it.
- Major version upgrades of libraries that change their module format (UMD to ESM-only, here) or that you've ever reached into via private/underscored APIs will cost you a real migration pass, even when the headline feature you wanted was "free." Grep your codebase for anything touching a library's internals before you upgrade past a major version — it's usually the first thing to break.
