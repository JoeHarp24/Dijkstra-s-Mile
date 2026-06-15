// src/app.js
import { graph } from "./graph.js";
import { dijkstra, findLoop, findCircularLoop } from "./dijkstra.js"; // Added findLoop import
import { Renderer } from "./renderer.js";

const canvas = document.getElementById("graphCanvas");
const output = document.getElementById("output");
const loopButton = document.getElementById("loopButton");
const distanceInput = document.getElementById("targetDistance");
const renderer = new Renderer("graphCanvas", graph);

let startNodeId = null;
let endNodeId = null;

// Setup: Draw the initial empty state
function refresh() {
  renderer.drawGraph();
  renderer.drawNodes(startNodeId, endNodeId);
}

refresh();

// --- LOGIC FOR MODE 1: CLICKING NODES (DIRECT PATH) ---
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let clickedNodeId = null;
  for (let nodeId in graph.nodes) {
    const node = graph.nodes[nodeId];
    const distance = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
    if (distance < 15) {
      clickedNodeId = nodeId;
      break;
    }
  }

  if (clickedNodeId) {
    // If we already have a path, reset everything on the next click
    if (startNodeId && endNodeId) {
      startNodeId = null;
      endNodeId = null;
    }

    if (!startNodeId) {
      startNodeId = clickedNodeId;
      endNodeId = null;
      output.innerText = `Start set to ${graph.nodes[startNodeId].label}. Click an end node...`;
    } else {
      endNodeId = clickedNodeId;
      const result = dijkstra(graph, startNodeId, endNodeId);
      output.innerText = `Path: ${result.path.join(" → ")} (Weight: ${result.distance})`;
    }

    renderer.drawGraph();
    renderer.drawNodes(startNodeId, endNodeId);

    if (startNodeId && endNodeId) {
      const result = dijkstra(graph, startNodeId, endNodeId);
      renderer.drawPath(result.path);
    }
  }
});

// --- LOGIC FOR MODE 2: BUTTON CLICK (LOOP FINDER) ---
loopButton.addEventListener("click", () => {
  const targetWeight = parseFloat(distanceInput.value);

  if (!startNodeId) {
    alert("Please click a Start node on the map first!");
    return;
  }

  if (isNaN(targetWeight) || targetWeight <= 0) {
    alert("Please enter a valid distance in the box.");
    return;
  }

  // Clear any existing "End Node" selection before finding loop
  endNodeId = null;

  const result = findCircularLoop(graph, startNodeId, targetWeight);

  if (result) {
    output.innerText = `Loop Found! Total Distance: ${result.distance} (Target: ${targetWeight})`;
    renderResult(result.path);
  } else {
    output.innerText = "No loop found near that distance.";
  }
});

// Helper function to draw the final result on screen
function renderResult(path) {
  renderer.drawGraph();
  renderer.drawNodes(startNodeId, null); // Highlight only the start node
  renderer.drawPath(path);
}
