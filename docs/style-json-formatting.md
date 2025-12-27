# style.json Formatting Guide

This document defines the formatting rules for `style.json` files in this project. **Always reference this guide when editing style.json files.**

## Overview

The goal is to make `style.json` files compact, usable, and readable while maintaining all functionality. The formatting rules prioritize:
- Reducing line count for simple structures
- Maintaining readability for complex expressions
- Preserving MapLibre expression structure

## Formatting Rules

### 1. Simple Arrays

**Rule:** Always format simple arrays on a single line, regardless of length.

**Examples:**
```json
// ✅ Correct
"text-font": ["Noto Sans Regular"]
"text-offset": [0, 1.2]
"filter": ["motorway", "trunk", "primary", "secondary"]

// ❌ Incorrect
"text-font": [
  "Noto Sans Regular"
]
"text-offset": [
  0,
  1.2
]
```

### 2. Simple Objects

**Rule:** Always format simple objects (2-3 properties) on a single line, regardless of length.

**Examples:**
```json
// ✅ Correct
{"line-cap": "round", "line-join": "round"}
{"icon-color": "#7a8ba3", "icon-opacity": 0.9, "text-color": "#a8b8d0"}

// ❌ Incorrect
{
  "line-cap": "round",
  "line-join": "round"
}
```

### 3. Simple Property-Value Pairs

**Rule:** Keep simple property-value pairs on one line when part of a larger object.

**Examples:**
```json
// ✅ Correct
"text-anchor": "top",
"minzoom": 12,
"maxzoom": 15

// ❌ Incorrect
"text-anchor":
  "top",
"minzoom":
  12
```

### 4. Nested Expressions (MapLibre)

**Rule:** Keep nested expression structure (each expression operator on its own line), but compact simple arrays within expressions. **Match expressions should always be compacted to one line** when used as property values or in interpolate expressions.

**Examples:**
```json
// ✅ Correct - match expressions always on one line
"line-color": ["match", ["get", "class"], "motorway", "#3a4657", "trunk", "#374251", "primary", "#34404f", "secondary", "#313b49", "#28313d"]

// ✅ Correct - keep structure for nested expressions (non-match)
[
  "case",
  ["==", ["get", "class"], "motorway"],
  true,
  false
]

// ❌ Incorrect - match expressions expanded
"line-color": [
  "match",
  ["get", "class"],
  "motorway",
  "#3a4657",
  "trunk",
  "#374251",
  "#28313d"
]
```

### 5. Complex Expressions (let, case)

**Rule:** Keep structure for readability. Each `let` variable binding on its own line. Each `case` condition on its own line. Compact simple arrays within these expressions. **All values in `let` expressions (including single-line expressions) must be indented to match the variable name indentation.**

**Indentation for Nested Case Expressions:** When `case` expressions are nested within other `case` expressions (or within `let` expressions), they should maintain proper indentation:
- Nested case opening bracket: same indent as the parent case's items
- Nested case operator: 2 spaces more than the opening bracket
- Nested case items: 2 spaces more than the opening bracket
- Nested case closing bracket: same indent as the opening bracket

For deeply nested case expressions (case within case within case), each level adds 2 more spaces for the operator and items.

**Examples:**
```json
// ✅ Correct - structured but compact arrays, proper indentation
[
  "let",
  "name",
  ["coalesce", ["get", "name:en"], ["get", "name"]],
  [
    "let",
    "dirReplaced",
    [
      "case",
      ["==", ["slice", ["var", "name"], 0, 6], "North "],
      ["concat", "N ", ["slice", ["var", "name"], 6]],
      ["==", ["slice", ["var", "name"], 0, 6], "South "],
      ["concat", "S ", ["slice", ["var", "name"], 6]],
      ["var", "name"]
    ],
    ["var", "dirReplaced"]
  ]
]

// ✅ Correct - nested case expressions with proper indentation
[
  "case",
  ["has", "rank"],
  [
    "case",
    ["<=", ["get", "rank"], 1],
    13,
    ["<=", ["get", "rank"], 2],
    11,
    ["var", "name"]
  ],
  [
    "case",
    ["in", "Reservoir", ["var", "name"]],
    11,
    ["var", "name"]
  ]
]

// ❌ Incorrect - single-line expression not indented
[
  "let",
  "name",
["coalesce", ["get", "name:en"], ["get", "name"]],  // Missing indentation!
  [...]
]

// ❌ Incorrect - too compact, loses readability
["let", "name", ["coalesce", ["get", "name:en"], ["get", "name"]], ["let", "dirReplaced", ["case", ...], ["var", "dirReplaced"]]]
```

### 6. Interpolate Expressions

**Rule:** Keep `interpolate` structure. Compact zoom/value pairs on one line when reasonable. **Match expressions used as values in interpolate should always be compacted to one line**, even if they contain multiple key-value pairs.

**Indentation for Expression Values:** When an `interpolate` expression uses complex expressions (like `let` or `case`) as values, the indentation should be normalized:
- Opening bracket of the value expression: same indent as the zoom level (typically 10 spaces)
- Base items within the value expression: 2 spaces more than the opening bracket (typically 12 spaces)
- Nested expressions within the value: maintain their relative structure from the base item level

**Examples:**
```json
// ✅ Correct - compact zoom/value pairs
[
  "interpolate",
  ["linear"],
  ["zoom"],
  0, 0.2,
  6, 0.6,
  12, 1.5
]

// ✅ Correct - match expressions compacted to one line
[
  "interpolate",
  ["linear"],
  ["zoom"],
  6, ["match", ["get", "class"], "motorway", 1.5, "trunk", 1.2, "primary", 1, "secondary", 0.9, "tertiary", 0.8, "residential", 0.7, "service", 0.5, "minor", 0.7, "unclassified", 0.7, 0.7],
  12, ["match", ["get", "class"], "motorway", 4, "trunk", 3.5, "primary", 2.8, "secondary", 2.2, "tertiary", 2.2, "residential", 1.8, "service", 1.5, "minor", 1.8, "unclassified", 1.8, 1.8],
  15, ["match", ["get", "class"], "motorway", 11, "trunk", 11, "primary", 11, "secondary", 8.5, "tertiary", 7, "residential", 5, "service", 5, "minor", 5, "unclassified", 5, 5]
]

// ✅ Correct - complex expression values with proper indentation
[
  "interpolate",
  ["linear"],
  ["zoom"],
  4,
  [
    "let",
    "name",
    ["coalesce", ["get", "name:en"], ["get", "name"]],
    [
      "case",
      ["has", "rank"],
      [
        "case",
        ["<=", ["get", "rank"], 1],
        13,
        ["<=", ["get", "rank"], 2],
        11,
        ["var", "name"]
      ],
      ["var", "name"]
    ]
  ],
  6,
  ["var", "name"]
]

// ❌ Incorrect - opening bracket not indented
[
  "interpolate",
  ["linear"],
  ["zoom"],
  4,
[  // Missing indentation!
    "let",
    ...
  ]
]

// ❌ Incorrect - match expressions expanded
[
  "interpolate",
  ["linear"],
  ["zoom"],
  6,
  [
    "match",
    ["get", "class"],
    "motorway",
    1.5,
    "trunk",
    1.2,
    ...
  ],
  12,
  [
    "match",
    ...
  ]
]

// ❌ Incorrect - too expanded
[
  "interpolate",
  [
    "linear"
  ],
  [
    "zoom"
  ],
  0,
  0.2,
  6,
  0.6
]
```

### 7. Layer Objects

**Rule:** Keep main structure (id, type, source, etc. on separate lines). Compact simple objects (layout, paint) where possible. Keep filter arrays structured but compact simple arrays within.

**Examples:**
```json
// ✅ Correct
{
  "id": "road-motorway",
  "type": "line",
  "source": "us_high",
  "source-layer": "transportation",
  "minzoom": 6,
  "filter": ["all", ["!=", ["get", "brunnel"], "tunnel"], ["match", ["get", "class"], ["motorway", "trunk"], true, false]],
  "layout": {"line-cap": "round", "line-join": "round"},
  "paint": {
    "line-color": ["match", ["get", "class"], "motorway", "#3a4657", "trunk", "#374251", "#28313d"],
    "line-width": ["interpolate", ["linear"], ["zoom"], 0, 0.2, 6, 0.6]
  }
}

// ❌ Incorrect - too expanded
{
  "id": "road-motorway",
  "type": "line",
  "source": "us_high",
  "source-layer": "transportation",
  "minzoom": 6,
  "filter": [
    "all",
    [
      "!=",
      [
        "get",
        "brunnel"
      ],
      "tunnel"
    ]
  ],
  "layout": {
    "line-cap": "round",
    "line-join": "round"
  }
}
```

### 8. Filter Arrays and Expression Arrays

**Rule:** Keep filter structure readable. Compact simple arrays within filters. Each filter condition can be on its own line for readability, but compact arrays within.

**Indentation for Case Expressions in Arrays:** When `case` expressions are used as values in arrays (e.g., in filter properties), they should be properly indented:
- Opening bracket: 10 spaces (2 more than the array's opening bracket at 8 spaces)
- Case operator: 12 spaces (2 more than the opening bracket)
- Case items: 12 spaces (same as operator)
- Closing bracket: 10 spaces (same as opening bracket)

**Indentation for Nested Expressions in Arrays:** When expressions like `all`, `any`, or nested `case` expressions are used as array values, they should maintain proper nesting:
- Opening bracket: same indent as other array items
- Expression operator: 2 spaces more than opening bracket
- Expression items: 2 spaces more than opening bracket
- Closing bracket: same indent as opening bracket

**Examples:**
```json
// ✅ Correct - case expression in filter array
"filter": [
  "all",
  ["has", "name"],
  [
    "case",
    ["has", "rank"],
    [">", ["get", "rank"], 3],
    false
  ]
]

// ✅ Correct - nested expressions in filter array
"filter": [
  "all",
  ["has", "name"],
  [
    "any",
    [
      "all",
      ["match", ["get", "class"], ["leisure", "park"], true, false],
      ["match", ["get", "subclass"], ["national_park"], true, false]
    ],
    ["match", ["get", "tourism"], ["national_park"], true, false]
  ]
]

// ❌ Incorrect - case expression items at wrong indent (6 spaces instead of 10)
"filter": ["all", ["has", "name"], [
  "case",
  ["has", "rank"],
  [">", ["get", "rank"], 3],
  false
]]

// ❌ Incorrect - too expanded
[
  "all",
  [
    "!=",
    [
      "get",
      "brunnel"
    ],
    "tunnel"
  ]
]
```

## General Principles

1. **Compactness First:** Simple structures (arrays, objects with few properties) should always be on one line.

2. **Readability for Complexity:** Complex expressions (let, case, deeply nested) should maintain structure for readability.

3. **Consistency:** Apply rules consistently throughout the file.

4. **Validation:** Always validate JSON syntax after formatting changes.

## Before/After Example

### Before (Expanded)
```json
{
  "id": "road-label",
  "type": "symbol",
  "source": "us_high",
  "source-layer": "transportation",
  "minzoom": 10,
  "filter": [
    "all",
    [
      "!=",
      [
        "get",
        "brunnel"
      ],
      "tunnel"
    ],
    [
      "match",
      [
        "get",
        "class"
      ],
      [
        "tertiary",
        "residential"
      ],
      true,
      false
    ]
  ],
  "layout": {
    "text-font": [
      "Noto Sans Regular"
    ],
    "text-size": [
      "interpolate",
      [
        "linear"
      ],
      [
        "zoom"
      ],
      10,
      8,
      14,
      12
    ]
  },
  "paint": {
    "text-color": "#a8b8d0"
  }
}
```

### After (Compact)
```json
{
  "id": "road-label",
  "type": "symbol",
  "source": "us_high",
  "source-layer": "transportation",
  "minzoom": 10,
  "filter": ["all", ["!=", ["get", "brunnel"], "tunnel"], ["match", ["get", "class"], ["tertiary", "residential"], true, false]],
  "layout": {
    "text-font": ["Noto Sans Regular"],
    "text-size": ["interpolate", ["linear"], ["zoom"], 10, 8, 14, 12]
  },
  "paint": {
    "text-color": "#a8b8d0"
  }
}
```

## Maintenance

- **Always reference this guide** when editing `style.json` files
- **Validate JSON** after any formatting changes
- **Test the map** to ensure functionality is preserved
- **Update this guide** if new formatting patterns emerge

