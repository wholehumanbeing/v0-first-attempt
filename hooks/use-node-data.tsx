"use client"

import { useState, useEffect } from "react"

// Sample data for the knowledge galaxy
const sampleNodes = [
  {
    id: 1,
    label: "Categorical Imperative",
    type: "AXIOM",
    position: [0, 0, 0],
    depth: 0,
    size: 1.2,
    importance: 0.9,
    content:
      "Act only according to that maxim whereby you can, at the same time, will that it should become a universal law.",
    created: "2023-05-15",
    modified: "2023-06-20",
    citations: [{ id: 1, text: "Kant, I. (1785). Groundwork of the Metaphysics of Morals." }],
    connections: [
      { id: 2, label: "Deontological Ethics", type: "CONCEPT" },
      { id: 3, label: "Immanuel Kant", type: "THINKER" },
    ],
  },
  {
    id: 2,
    label: "Deontological Ethics",
    type: "CONCEPT",
    position: [5, 1, 3],
    depth: 3,
    size: 1.0,
    importance: 0.7,
    content: "Ethical theory that uses rules to distinguish right from wrong, focusing on duties and rules.",
    created: "2023-05-16",
    modified: "2023-06-21",
    connections: [
      { id: 1, label: "Categorical Imperative", type: "AXIOM" },
      { id: 4, label: "Utilitarianism", type: "CONCEPT" },
    ],
  },
  {
    id: 3,
    label: "Immanuel Kant",
    type: "THINKER",
    position: [-4, -1, 2],
    depth: 2,
    size: 1.1,
    importance: 0.8,
    content:
      "German philosopher who is a central figure in modern philosophy. Kant argued that the human mind creates the structure of human experience.",
    created: "2023-05-17",
    modified: "2023-06-22",
    connections: [{ id: 1, label: "Categorical Imperative", type: "AXIOM" }],
  },
  {
    id: 4,
    label: "Utilitarianism",
    type: "CONCEPT",
    position: [8, -2, -4],
    depth: -4,
    size: 1.0,
    importance: 0.7,
    content:
      "Ethical theory that states that the best action is the one that maximizes utility, usually defined as happiness or well-being.",
    created: "2023-05-18",
    modified: "2023-06-23",
    connections: [
      { id: 2, label: "Deontological Ethics", type: "CONCEPT" },
      { id: 5, label: "John Stuart Mill", type: "THINKER" },
    ],
  },
  {
    id: 5,
    label: "John Stuart Mill",
    type: "THINKER",
    position: [12, 0, -6],
    depth: -6,
    size: 1.0,
    importance: 0.6,
    content:
      "English philosopher, political economist, and civil servant. One of the most influential thinkers in the history of classical liberalism.",
    created: "2023-05-19",
    modified: "2023-06-24",
    connections: [{ id: 4, label: "Utilitarianism", type: "CONCEPT" }],
  },
  {
    id: 6,
    label: "Ethical Framework",
    type: "SYNTHESIS",
    position: [3, 4, -2],
    depth: -2,
    size: 1.3,
    importance: 0.9,
    content:
      "A synthesis of deontological and utilitarian approaches, considering both rules and consequences in ethical decision-making.",
    created: "2023-05-20",
    modified: "2023-06-25",
    connections: [
      { id: 1, label: "Categorical Imperative", type: "AXIOM" },
      { id: 2, label: "Deontological Ethics", type: "CONCEPT" },
      { id: 4, label: "Utilitarianism", type: "CONCEPT" },
    ],
  },
  {
    id: 7,
    label: "Virtue Ethics",
    type: "CONCEPT",
    position: [-7, 3, -5],
    depth: -5,
    size: 0.9,
    importance: 0.5,
    content:
      "Approach to ethics that emphasizes an individual's character as the key element of ethical thinking, rather than rules or consequences.",
    created: "2023-05-21",
    modified: "2023-06-26",
    connections: [{ id: 8, label: "Aristotle", type: "THINKER" }],
  },
  {
    id: 8,
    label: "Aristotle",
    type: "THINKER",
    position: [-10, 1, -8],
    depth: -8,
    size: 1.1,
    importance: 0.8,
    content:
      "Greek philosopher and polymath during the Classical period in Ancient Greece. Student of Plato and founder of the Lyceum.",
    created: "2023-05-22",
    modified: "2023-06-27",
    connections: [{ id: 7, label: "Virtue Ethics", type: "CONCEPT" }],
  },
  {
    id: 9,
    label: "Moral Relativism",
    type: "CONCEPT",
    position: [0, -5, -10],
    depth: -10,
    size: 0.8,
    importance: 0.4,
    content:
      "View that moral judgments are true or false only relative to some particular standpoint (cultural, historical, personal).",
    created: "2023-05-23",
    modified: "2023-06-28",
    connections: [],
  },
  {
    id: 10,
    label: "Comprehensive Moral Theory",
    type: "SYNTHESIS",
    position: [-2, 7, 5],
    depth: 5,
    size: 1.4,
    importance: 1.0,
    content:
      "A synthesis of multiple ethical frameworks, recognizing the complexity of moral decision-making across different contexts.",
    created: "2023-05-24",
    modified: "2023-06-29",
    connections: [
      { id: 1, label: "Categorical Imperative", type: "AXIOM" },
      { id: 2, label: "Deontological Ethics", type: "CONCEPT" },
      { id: 4, label: "Utilitarianism", type: "CONCEPT" },
      { id: 6, label: "Ethical Framework", type: "SYNTHESIS" },
      { id: 7, label: "Virtue Ethics", type: "CONCEPT" },
    ],
  },
]

// Generate edges from the connections in the nodes
const generateEdges = (nodes) => {
  const edges = []
  let edgeId = 1

  nodes.forEach((node) => {
    if (node.connections) {
      node.connections.forEach((connection) => {
        // Check if this edge already exists in reverse direction
        const existingEdge = edges.find((e) => e.source === connection.id && e.target === node.id)

        if (!existingEdge) {
          edges.push({
            id: edgeId++,
            source: node.id,
            target: connection.id,
            semantic_type: getRandomEdgeType(),
            weight: Math.random() * 0.5 + 0.5, // Random weight between 0.5 and 1
          })
        }
      })
    }
  })

  return edges
}

// Helper to get a random edge type for the sample data
function getRandomEdgeType() {
  const types = [
    "IS",
    "HAS",
    "DEPENDS_ON",
    "CONTRASTS_WITH",
    "CONFLICTS_WITH",
    "IMPLIES",
    "EMERGES_FROM",
    "TRANSFORMS_INTO",
    "ALIGNS_WITH",
    "SYMBOLIZES",
    "CONTAINS_TENSION_WITHIN",
    "SEEKS",
  ]
  return types[Math.floor(Math.random() * types.length)]
}

export function useNodeData() {
  const [nodes, setNodes] = useState(sampleNodes)
  const [edges, setEdges] = useState([])

  useEffect(() => {
    // Generate edges from node connections
    const generatedEdges = generateEdges(nodes)
    setEdges(generatedEdges)
  }, [nodes])

  return { nodes, edges, setNodes, setEdges }
}
