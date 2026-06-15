// src/renderer.js

export class Renderer {
  constructor(canvasId, graph) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.graph = graph;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGraph() {
    this.clear();
    this.drawEdges();
    this.drawNodes();
  }

  drawEdges() {
    this.ctx.strokeStyle = "#ccc";
    this.ctx.lineWidth = 2;
    for (let startNodeId in this.graph.edges) {
      const edges = this.graph.edges[startNodeId];
      const startPos = this.graph.nodes[startNodeId];

      for (let edge of edges) {
        const endPos = this.graph.nodes[edge.to];
        this.ctx.beginPath();
        this.ctx.moveTo(startPos.x, startPos.y);
        this.ctx.lineTo(endPos.x, endPos.y);
        this.ctx.stroke();

        const midX = (startPos.x + endPos.x) / 2;
        const midY = (startPos.y + endPos.y) / 2;
        this.ctx.fillStyle = "#666";
        this.ctx.font = "12px Arial";
        this.ctx.fillText(edge.weight, midX, midY);
      }
    }
  }

  // We added startNodeId and endNodeId as arguments!
  drawNodes(startNodeId, endNodeId) {
    for (let nodeId in this.graph.nodes) {
      const node = this.graph.nodes[nodeId];

      // Logic to change color based on selection
      if (nodeId === startNodeId) {
        this.ctx.fillStyle = "#4CAF50"; // Green for Start
      } else if (nodeId === endNodeId) {
        this.ctx.fillStyle = "#F44336"; // Red for End
      } else {
        this.ctx.fillStyle = "#333"; // Default Dark Grey
      }

      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = "#000"; // Text color
      this.ctx.font = "bold 14px Arial";
      this.ctx.fillText(node.label, node.x + 18, node.y + 5);
    }
  }

  drawPath(path) {
    if (!path || path.length < 2) return;

    this.ctx.strokeStyle = "#4CAF50";
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();

    const startNode = this.graph.nodes[path[0]];
    this.ctx.moveTo(startNode.x, startNode.y);

    for (let i = 1; i < path.length; i++) {
      const node = this.graph.nodes[path[i]];
      this.ctx.lineTo(node.x, node.y);
    }
    this.ctx.stroke();
  }
}
