# Dijkstra's Mile - Route Planner Engine

This project is a web-based route planning application designed to find the most efficient path between two points on a map, with the cost of travel dynamically determined by changes in elevation. The goal is to help users plan routes that minimize the energy expenditure required for their run, prioritizing routes with minimal uphill travel.

## Overview

The application functions as a **Weighted Graph System**. Instead of using simple Euclidean distance, the edges (streets) connecting locations are assigned weights based on both the physical distance and the change in elevation along that path. This ensures that routes involving steep climbs are penalized heavily, guiding the user toward paths that minimize energy expenditure.

**Core Functionality:**

1.  **Data Input:** Load geographical data, ideally in **GeoJSON** format, which defines the street network geometry and elevation profiles.
2.  **Graph Construction:** Build an internal graph where nodes represent intersections/points of interest, and edges represent streets connecting them.
3.  **Weighted Pathfinding:** Use Dijkstra's algorithm to calculate the path between two points. The "cost" of traversing an edge is calculated as:
    $$\text{Edge Weight} = \text{Distance} \times (\text{Elevation}_{\text{to}} - \text{Elevation}_{\text{from}})$$
4.  **Visualization:** Render the resulting optimal path on a canvas map for visual feedback.

## 🚀 How to run in Codespaces/locally

1. From the terminal:

```bash
python3 -m http.server 5500
```

2. Open your browser and navigate to `http://localhost:5500`

## ⚙️ Technical Breakdown

### File Structure

- `index.html`: The user interface, containing input controls and the canvas for visualization.
- `style.css`: Stylesheet for the application interface.
- `src/graph.js`: Defines the structure of the graph (nodes and edges). _This file is designed to be populated dynamically from GeoJSON._
- `src/dijkstra.js`: Implements the core pathfinding algorithm, which now utilizes dynamic edge weights derived from elevation changes.
- `src/app.js`: The main application script that handles user input, orchestrates graph building (once GeoJSON is loaded), and calls the pathfinding functions to update the visualization.

### Deep Dive: `src/dijkstra.js`

The `dijkstra.js` file implements the core shortest-path algorithm, adapted to handle custom weighted edges.

**Core Logic:**

1.  **Initialization:** It initializes distances for all nodes to infinity, sets the distance to the `startNode` to 0, and uses a priority queue simulation to track unvisited nodes.
2.  **Iteration:** It iteratively selects the unvisited node with the smallest known distance (`currNode`).
3.  **Neighbor Relaxation (The Key Change):** When exploring neighbors, it calculates a **dynamic cost**. This cost is the result of applying the elevation-based weighting formula to the edge's geometric distance and the elevation difference between the current node and its neighbor (`edge.weight`).
4.  **Path Reconstruction:** Once the destination is reached, it traces back through the `prev` pointers to reconstruct the actual path taken and reports the total calculated weight (energy expenditure).

**How Weighting Works:**
The algorithm prioritizes paths that have the lowest cumulative weighted cost. A lower final weight means a path that minimizes energy loss due to uphill travel over the total distance.

### ⚖️ Choices and Tradeoffs

| Feature              | Choice Made                                       | Rationale / Tradeoff                                                                                                                 | Impact                                                                                                      |
| :------------------- | :------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **Data Source**      | GeoJSON                                           | Industry standard for geospatial data. Highly scalable and widely compatible with mapping tools.                                     | Requires an initial step to parse the external file structure into the graph format.                        |
| **Weighting Metric** | $\text{Distance} \times (\Delta\text{Elevation})$ | Directly addresses the user's primary goal: minimizing energy spent on uphill travel.                                                | The resulting path is mathematically the most "energy-efficient" route based on your defined cost function. |
| **Algorithm**        | Dijkstra's                                        | Optimal for finding the single-source shortest path in a graph with non-negative edge weights (which elevation differences will be). | Ensures the _absolute_ minimum weighted path is found.                                                      |
| **Graph Structure**  | Dynamic/Ad-hoc Loading                            | We build the graph from external data rather than predefining all streets statically.                                                | Increases flexibility, allowing any GeoJSON dataset to be used without modifying the core code.             |

## ⏭️ Next Steps

The next phase of development I plan on focusing on implementing the I/O layer: loading a GeoJSON file and writing the parsing logic into `src/app.js` to populate the graph and edges dynamically before calling Dijkstra's algorithm to allow for more accurate data input when it comes to developing this planning application.
