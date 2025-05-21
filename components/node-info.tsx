"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Markdown } from "./markdown"

export function NodeInfo({ node }) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!node) return null

  // Get node color based on type
  const getNodeColor = (type) => {
    switch (type) {
      case "AXIOM":
        return "bg-amber-100 border-amber-300 text-amber-900"
      case "CONCEPT":
        return "bg-purple-100 border-purple-300 text-purple-900"
      case "THINKER":
        return "bg-blue-100 border-blue-300 text-blue-900"
      case "SYNTHESIS":
        return "bg-pink-100 border-pink-300 text-pink-900"
      case "ARCHETYPE":
      case "SYMBOL":
      case "MYTH":
        return "bg-teal-100 border-teal-300 text-teal-900"
      default:
        return "bg-gray-100 border-gray-300 text-gray-900"
    }
  }

  const nodeColorClass = getNodeColor(node.type)

  return (
    <Card className={`border-2 ${nodeColorClass} shadow-lg backdrop-blur-md bg-opacity-90`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{node.label || node.name}</CardTitle>
            <CardDescription className="capitalize">{node.type}</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              Link
            </Button>
            <Button variant="outline" size="sm">
              ×
            </Button>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mx-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>

        <CardContent className="pt-4">
          <TabsContent value="overview" className="mt-0">
            <Markdown content={node.content || "No content available."} />
          </TabsContent>

          <TabsContent value="connections" className="mt-0">
            <h3 className="font-medium mb-2">Connected Nodes</h3>
            <ul className="space-y-1">
              {node.connections?.map((conn) => (
                <li key={conn.id} className="flex justify-between items-center p-2 bg-black/20 rounded">
                  <span>{conn.label || conn.name}</span>
                  <span className="text-xs opacity-70">{conn.type}</span>
                </li>
              )) || <li className="italic opacity-70">No connections</li>}
            </ul>
          </TabsContent>

          <TabsContent value="metadata" className="mt-0">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>{node.created || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Modified:</span>
                <span>{node.modified || "Unknown"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Importance:</span>
                <span>{node.importance || 0}/1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Depth:</span>
                <span>{node.depth || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Citations:</span>
                <span>{node.citations?.length || 0}</span>
              </div>
              {node.ki_id && (
                <div className="flex justify-between">
                  <span className="font-medium">Knowledge Index ID:</span>
                  <span className="text-xs font-mono">{node.ki_id}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm">
          Summarize
        </Button>
        <Button variant="outline" size="sm">
          Open in Sidebar
        </Button>
      </CardFooter>
    </Card>
  )
}
