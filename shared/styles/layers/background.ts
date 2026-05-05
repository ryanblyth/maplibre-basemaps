/**
 * Background layers
 */

import type { ExpressionSpecification } from "@maplibre/maplibre-gl-style-spec";
import type { LayerSpecification } from "maplibre-gl";
import type { Theme } from "../theme.js";

export function createBackgroundLayers(theme: Theme): LayerSpecification[] {
  const wlz = theme.worldLowZoomLand;
  const bgAtZ0 = wlz?.backgroundAtZ0;
  const blendEnd = wlz?.blendEndZoom ?? 5.5;
  const baseBg = theme.colors.background;

  let backgroundColor: string | ExpressionSpecification = baseBg;
  if (bgAtZ0 !== undefined && bgAtZ0 !== "") {
    backgroundColor = [
      "interpolate",
      ["linear"],
      ["zoom"],
      0,
      bgAtZ0,
      blendEnd,
      baseBg,
    ] as ExpressionSpecification;
  }

  return [
    {
      id: "background",
      type: "background",
      paint: { "background-color": backgroundColor },
    },
  ];
}
