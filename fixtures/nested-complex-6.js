module.exports.schema = {
  id: "int32",
  x: "int32",
  y: "int32",
  placables: [{
    item: "string",
    ownerId: "string",
    id: "string",
    claimable: "boolean",
    claimed: "boolean",
    coord: { x: "int32", y: "int32" },
    expiration: "string",
    spriteMap: "string",
    spriteMapKey: "string",
    rotation: "int32"
  }],
  dimensions: "int32",
  areaDimensions: "int32",
  areas: [{
    id: "int32",
    x: "int32",
    y: "int32",
    biome: "int32",
    weight: "float32",
    isAccessible: "boolean",
    resources: [{
      id: "string",
      position: { x: "int32", y: "int32" },
      active: "boolean",
      classification: "string",
      interactive: "boolean",
      abstract: "string",
      availability: "int32",
      state: { i: "int32", w: "string", a: "string", l: "string", r: "string", sha: "string", shi: "string" }
    }],
    boundries: {
      vertices: [{ x: "float32", y: "float32" }],
      min: { x: "int32", y: "int32" },
      max: { x: "int32", y: "int32" },
      size: { x: "int32", y: "int32" }
    }
  }],
  boundries: ["int32"]
}

module.exports.items = [
  {
    "id": 2111339991,
    "placables": [],
    "x": 3,
    "y": 2,
    "dimensions": 16,
    "areaDimensions": 128,
    "areas": [
      {
        "id": 2114289141,
        "x": 48,
        "y": 32,
        "boundries": {
          "vertices": [
            { "x": -35.052616119384766, "y": -45.469512939453125 },
            { "x": -14.295523643493652, "y": 4.885631084442139 },
            { "x": 30.104928970336914, "y": 24.392292022705078 }
          ],
          "min": { "x": -35, "y": -100 },
          "max": { "x": 109, "y": 24 },
          "size": { "x": 144, "y": 124 }
        },
        "biome": 0,
        "weight": 0.06912259757518768,
        "isAccessible": true,
        "resources": []
      },
      {
        "id": 2114289146,
        "x": 48,
        "y": 37,
        "boundries": {
          "vertices": [
            { "x": -63.573089599609375, "y": -62.38645553588867 },
            { "x": -29.82942771911621, "y": 20.665653228759766 },
            { "x": -23.759756088256836, "y": 28.030988693237305 }
          ],
          "min": { "x": -63, "y": -105 },
          "max": { "x": 124, "y": 93 },
          "size": { "x": 188, "y": 199 }
        },
        "biome": 0,
        "weight": 0.21172510087490082,
        "isAccessible": true,
        "resources": [
          {
            "active": true,
            "abstract": "Proc",
            "classification": "Wheat",
            "availability": 1000,
            "interactive": true,
            "position": { "x": 69, "y": -84 },
            "state": { "i": 4, "w": "0", "r": "-", "a": "-", "l": "-", "sha": "-", "shi": "-" },
            "id": "2114289146_2_4"
          },
          {
            "active": true,
            "abstract": "Proc",
            "classification": "Wheat",
            "availability": 1000,
            "interactive": true,
            "position": { "x": 48, "y": -78 },
            "state": { "i": 4, "w": "0", "r": "-", "a": "-", "l": "-", "sha": "-", "shi": "-" },
            "id": "2114289146_3_4"
          }
        ]
      }
    ],
    "boundries": [0, 0, 2, 2]
  }
]
