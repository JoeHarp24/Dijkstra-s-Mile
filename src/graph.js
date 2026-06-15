// src/graph.js

export const graph = {
  nodes: {
    // --- Residential Area (West) ---
    home: { x: 50, y: 50, label: "Home" },
    oak_st: { x: 150, y: 50, label: "Oak St" },
    maple_ave: { x: 50, y: 150, label: "Maple Ave" },
    elm_street: { x: 150, y: 150, label: "Elm Street" },

    // --- The Town Center (Middle) ---
    bakery: { x: 300, y: 80, label: "Bakery" },
    cafe: { x: 300, y: 250, label: "Cafe" },
    pharmacy: { x: 450, y: 150, label: "Pharmacy" },
    library: { x: 300, y: 350, label: "Library" },

    // --- The Park Area (East) ---
    park_entrance: { x: 550, y: 50, label: "Park Entrance" },
    pond: { x: 550, y: 200, label: "The Pond" },
    trail_head: { x: 550, y: 350, label: "Trail Head" },

    // --- Industrial/Main Road (South) ---
    gas_station: { x: 150, y: 350, label: "Gas Station" },
    main_intersection: { x: 450, y: 350, label: "Main & 5th" },
  },

  edges: {
    // West connections
    home: [
      { to: "oak_st", weight: 10 },
      { to: "maple_ave", weight: 12 },
    ],
    oak_st: [
      { to: "home", weight: 10 },
      { to: "elm_street", weight: 15 },
      { to: "bakery", weight: 40 },
    ],
    maple_ave: [
      { to: "home", weight: 12 },
      { to: "elm_street", weight: 8 },
      { to: "gas_station", weight: 30 },
    ],
    elm_street: [
      { to: "oak_st", weight: 15 },
      { to: "maple_ave", weight: 8 },
      { to: "bakery", weight: 25 },
      { to: "cafe", weight: 20 },
      { to: "gas_station", weight: 15 },
    ],

    // Center connections
    bakery: [
      { to: "oak_st", weight: 40 },
      { to: "elm_street", weight: 25 },
      { to: "pharmacy", weight: 30 },
      { to: "cafe", weight: 18 },
    ],
    cafe: [
      { to: "elm_street", weight: 20 },
      { to: "bakery", weight: 18 },
      { to: "library", weight: 15 },
      { to: "pharmacy", weight: 25 },
      { to: "main_intersection", weight: 35 },
    ],
    pharmacy: [
      { to: "bakery", weight: 30 },
      { to: "cafe", weight: 25 },
      { to: "park_entrance", weight: 45 },
      { to: "pond", weight: 20 },
      { to: "main_intersection", weight: 25 },
    ],
    library: [
      { to: "cafe", weight: 15 },
      { to: "gas_station", weight: 25 },
      { to: "main_intersection", weight: 10 },
    ],

    // East/Park connections
    park_entrance: [
      { to: "pharmacy", weight: 45 },
      { to: "pond", weight: 25 },
    ],
    pond: [
      { to: "park_entrance", weight: 25 },
      { to: "pharmacy", weight: 20 },
      { to: "trail_head", weight: 30 },
    ],
    trail_head: [
      { to: "pond", weight: 30 },
      { to: "main_intersection", weight: 40 },
    ],

    // South/Industrial connections
    gas_station: [
      { to: "elm_street", weight: 15 },
      { to: "maple_ave", weight: 30 },
      { to: "library", weight: 25 },
      { to: "main_intersection", weight: 45 },
    ],
    main_intersection: [
      { to: "cafe", weight: 35 },
      { to: "pharmacy", weight: 25 },
      { to: "library", weight: 10 },
      { to: "gas_station", weight: 45 },
      { to: "trail_head", weight: 40 },
    ],
  },
};
