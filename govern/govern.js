'use strict';
console.time('Took: ');
const fs = require('fs');

const taskName = 'govern';
const inputFileName = process.argv[2] || taskName + '.in',
  outputFileName = process.argv[3] || taskName + '.out';

fs.readFile(inputFileName, 'utf8', (err, data) => {
  if (err) throw err;
  let edges = [],
    vertices = new Map();
  data.split('\n').map(relation => {
    if (!relation) {
      return null;
    }
    let [start, end] = relation.split(' ');
    if (!vertices.has(start)) {
      vertices.set(start, new Vertex(start));
    }
    if (!vertices.has(end)) {
      vertices.set(end, new Vertex(end));
    }
    let edge = new Edge(vertices.get(start), vertices.get(end));
    edges.push(edge);
    vertices.get(start).outboundEdges.push(edge);
  });
  let graph = new Graph(vertices, edges);
  let order = tarjanDFS(graph);
  order.push('')
  fs.writeFile(outputFileName, order.join('\n'), err => {
    if (err) throw err;
    console.timeEnd('Took: ');
  });
});

function tarjanDFS(graph) {
  const NOT_VISITED = 0,
    VISITED = 1,
    VISITED_AND_RESOLVED = 2;
  let order = [],
    unvisitedVertices = new Set(graph.vertices.values()),
    visitedStatus = {};
    graph.vertices.forEach(function (value, label) {
      visitedStatus[label] = NOT_VISITED;
    });

  while (unvisitedVertices.size) {
    traverseStack(unvisitedVertices[Symbol.iterator]().next().value);
  }

  return order;

  function traverse(vertex) {
    let status = visitedStatus[vertex.label];

    if (VISITED === status) {
      throw new Error('not a DAG');
    }

    if (NOT_VISITED === status) {
      if (unvisitedVertices.has(vertex))
      unvisitedVertices.delete(vertex);
      visitedStatus[vertex.label] = VISITED;
      vertex.outboundEdges
        .map(edge => edge.endVertex)
        .map(traverse);
      visitedStatus[vertex.label] = VISITED_AND_RESOLVED;
      order.push(vertex.label);
    }

  }

  function traverseStack(startVertex) {
    let stack = [startVertex],
      orderSet = new Set();
    while (stack.length > 0) {
      let vertex = stack.pop();
      visitedStatus[vertex.label] = VISITED;
      if (unvisitedVertices.has(vertex)) {
        unvisitedVertices.delete(vertex);
      }
      let unvisitedNeibours = [];
      vertex.outboundEdges
        .map(edge => edge.endVertex)
        .map(neighbour => {
          if (VISITED === visitedStatus[neighbour.label]) {
            throw new Error('not a DAG');
          }
          if (NOT_VISITED === visitedStatus[neighbour.label]) {
            unvisitedNeibours.push(neighbour);
          }
        });
      if (0 === unvisitedNeibours.length) {
        visitedStatus[vertex.label] = VISITED_AND_RESOLVED;
        if (!orderSet.has(vertex)) {
          orderSet.add(vertex);
          order.push(vertex.label);
        }
      } else {
        stack.push(vertex);
        stack = stack.concat(unvisitedNeibours);
      }
    }
  }

}

function Graph(vertices, edges) {
  this.vertices = vertices;
  this.edges = edges;
}

function Vertex(label) {
  this.label = label;
  this.outboundEdges = [];
}
Vertex.prototype.toString = function() {
  return `Label: ${this.label}, Edges:`;
}

function Edge(startVertex, endVertex) {
  this.startVertex = startVertex;
  this.endVertex = endVertex;
}