export function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const prev = {};
  const pq = new Set(); // A simple priority queue substitute for Phase 1

  // Initialization
  for (let node in graph.nodes) {
    distances[node] = Infinity;
    prev[node] = null;
    pq.add(node);
  }
  distances[startNode] = 0;

  while (pq.size > 0) {
    // Find the node in pq with the smallest distance
    let currNode = null;
    for (let node of pq) {
      if (currNode === null || distances[node] < distances[currNode]) {
        currNode = node;
      }
    }

    // If we reached the end or unreachable nodes
    if (currNode === endNode || distances[currNode] === Infinity) break;

    pq.delete(currNode);

    // Check neighbors
    const neighbors = graph.edges[currNode] || [];
    for (let edge of neighbors) {
      let alt = distances[currNode] + edge.weight;
      if (alt < distances[edge.to]) {
        distances[edge.to] = alt;
        prev[edge.to] = currNode;
      }
    }
  }

  // Reconstruct the path
  const path = [];
  let u = endNode;
  if (prev[u] || u === startNode) {
    while (u !== null) {
      path.unshift(u);
      u = prev[u];
    }
  }

  return {
    path: path,
    distance: distances[endNode],
  };
}

/**
 * Finds an 'out-and-back' loop that starts and ends at startNodeId
 * with a total distance as close to targetWeight as possible.
 */
export function findLoop(graph, startNodeId, targetWeight) {
  let bestResult = null;
  let minDifference = Infinity;

  // Step 1: Iterate through every node in the graph
  for (const nodeId in graph.nodes) {
    // Skip the start node itself (distance would be 0)
    if (nodeId === startNodeId) continue;

    // Step 2: Find the shortest path from Start to this potential turning point
    const result = dijkstra(graph, startNodeId, nodeId);

    // The total loop weight is essentially going there and coming back
    const loopWeight = result.distance * 2;

    // How close are we to the target? (e.g., |60 - 100| = 40)
    const difference = Math.abs(loopWeight - targetWeight);

    // Step 3: If this is the closest we've found so far, save it!
    if (difference < minDifference) {
      minDifference = difference;

      // Construct the loop path array: [Start -> TurningPoint] + [TurningPoint -> Start]
      // We use .slice(1) on the reversed part so we don't list the 'turning point' twice in a row.
      const returnPath = [...result.path].reverse().slice(1);

      bestResult = {
        path: [...result.path, ...returnPath],
        distance: loopWeight,
      };
    }
  }

  return bestResult;
}

/**
 * Finds a circular 'loop' (A -> B -> A) that does NOT reuse the same edges.
 * Uses a "modified graph" approach: find path there, remove those streets, find path back.
 */
export function findCircularLoop(graph, startNodeId, targetWeight) {
  let bestResult = null;
  let minDifference = Infinity;

  // Iterate through every possible 'turning point' in the town
  for (const intersectionNodeId in graph.nodes) {
    if (intersectionNodeId === startNodeId) continue;

    // 1. Find shortest path from Start to this potential turning point
    const pathToIntersection = dijkstra(graph, startNodeId, intersectionNodeId);

    // If we can't even get to this node, skip it
    if (!pathToIntersection || pathToIntersection.distance === Infinity)
      continue;

    // 2. Create a temporary "Modified Graph" for the return trip
    // We copy the edges so we don't ruin the original graph
    const modifiedEdges = {};
    for (let nodeId in graph.edges) {
      modifiedEdges[nodeId] = [...graph.edges[nodeId]];
    }

    // "Burn the bridges": Remove the streets used in our first path from the temp map
    for (let i = 0; i < pathToIntersection.path.length - 1; i++) {
      const u = pathToIntersection.path[i];
      const v = pathToIntersection.path[i + 1];

      // Remove u -> v and the reverse v -> u to prevent any backtracking on these streets
      modifiedEdges[u] = modifiedEdges[u].filter((edge) => edge.to !== v);
      modifiedEdges[v] = modifiedEdges[v].filter((edge) => edge.to !== u);
    }

    const modifiedGraph = { ...graph, edges: modifiedEdges };

    // 3. Find the shortest path from the Intersection back to Home in the "Burned Bridge" map
    const pathToStart = dijkstra(
      modifiedGraph,
      intersectionNodeId,
      startNodeId,
    );

    if (pathToStart && pathToStart.distance !== Infinity) {
      const totalDistance = pathToIntersection.distance + pathToStart.distance;
      const difference = Math.abs(totalDistance - targetWeight);

      // 4. If this circle is closer to our target than the previous best, save it!
      if (difference < minDifference) {
        minDifference = difference;
        // Combine: [Start -> Intersection] + [Intersection -> Start (skipping the first repeated node)]
        const fullCirclePath = [
          ...pathToIntersection.path,
          ...pathToStart.path.slice(1),
        ];
        bestResult = {
          path: fullCirclePath,
          distance: totalDistance,
        };
      }
    }
  }

  return bestResult;
}
