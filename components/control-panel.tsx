"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ControlPanel() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-4 left-4 z-10">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-gray-900 text-white border-gray-700 hover:bg-gray-800">
            Controls
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-black/90 backdrop-blur-md border-gray-700 text-white">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Navigation Controls</h3>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-800 p-2 rounded">
                  <span className="font-bold">Orbit Mode</span>
                  <ul className="mt-1 space-y-1 opacity-80">
                    <li>Left-drag: Rotate</li>
                    <li>Right-drag: Pan</li>
                    <li>Scroll: Zoom</li>
                  </ul>
                </div>

                <div className="bg-gray-800 p-2 rounded">
                  <span className="font-bold">First Person</span>
                  <ul className="mt-1 space-y-1 opacity-80">
                    <li>WASD: Move</li>
                    <li>Shift: Speed up</li>
                    <li>Space/Ctrl: Up/Down</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Interaction</h4>
              <ul className="space-y-1 text-sm opacity-80">
                <li>Click: Select node</li>
                <li>Shift+Click+Drag: Create edge</li>
                <li>Double-click: Open node details</li>
                <li>Shift+Click multiple: Multi-select</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Visual Settings</h4>

              <div className="flex items-center justify-between">
                <Label htmlFor="node-size">Node Size</Label>
                <Slider id="node-size" defaultValue={[1]} max={2} min={0.5} step={0.1} className="w-[60%]" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edge-opacity">Edge Opacity</Label>
                <Slider id="edge-opacity" defaultValue={[0.6]} max={1} min={0.1} step={0.1} className="w-[60%]" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-labels">Show Labels</Label>
                <Switch id="show-labels" defaultChecked />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
