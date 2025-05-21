"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function NodeCreationPanel({ onSelect, onCancel }) {
  const nodeTypes = [
    { id: "CONCEPT", name: "Concept", color: "bg-purple-500" },
    { id: "THINKER", name: "Thinker", color: "bg-blue-500" },
    { id: "AXIOM", name: "Axiom", color: "bg-amber-500" },
    { id: "SYNTHESIS", name: "Synthesis", color: "bg-pink-500" },
    { id: "ARCHETYPE", name: "Archetype", color: "bg-teal-500" },
    { id: "SYMBOL", name: "Symbol", color: "bg-cyan-500" },
    { id: "CUSTOM", name: "Custom", color: "bg-gray-500" },
  ]

  return (
    <Card className="w-64 backdrop-blur-md bg-black/80 border-gray-700 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Create New Node</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {nodeTypes.map((type) => (
          <Button key={type.id} className={`w-full justify-start ${type.color}`} onClick={() => onSelect(type.id)}>
            <div className={`w-3 h-3 rounded-full mr-2 ${type.color}`} />
            {type.name}
          </Button>
        ))}
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}
