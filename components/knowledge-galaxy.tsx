"use client"

import { useRef, useState, useMemo, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Stars, Html, Line, Sphere } from "@react-three/drei"
import * as THREE from "three"
import { NodeInfo } from "./node-info"
import { AdaptiveGrid } from "./adaptive-grid"
import { ControlPanel } from "./control-panel"
import { NodeCreationPanel } from "./node-creation-panel"
import { useNodeData } from "@/hooks/use-node-data"
import { useControls } from "@/hooks/use-controls"

export default function KnowledgeGalaxy() {
  const [firstPersonMode, setFirstPersonMode] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [multiSelectedNodes, setMultiSelectedNodes] = useState([])
  const [showNodeCreationPanel, setShowNodeCreationPanel] = useState(false)
  const [nodeCreationPosition, setNodeCreationPosition] = useState([0, 0, 0])
  const [sourceNode, setSourceNode] = useState(null)
  const [isCreatingEdge, setIsCreatingEdge] = useState(false)
  const [edgeEndPosition, setEdgeEndPosition] = useState([0, 0, 0])
  const [showGrid, setShowGrid] = useState(false)
  const [gridFadeTimeout, setGridFadeTimeout] = useState(null)
  const [previewDepth, setPreviewDepth] = useState(() => {
    // Use localStorage to persist the depth preview preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("previewDepth")
      return saved !== null ? saved === "true" : true
    }
    return true
  })

  const handleMouseMove = () => {
    setShowGrid(true)

    if (gridFadeTimeout) clearTimeout(gridFadeTimeout)

    const timeout = setTimeout(() => {
      setShowGrid(false)
    }, 2000)

    setGridFadeTimeout(timeout)
  }

  const toggleFirstPersonMode = () => {
    setFirstPersonMode(!firstPersonMode)
  }

  const togglePreviewDepth = useCallback(() => {
    const newValue = !previewDepth
    setPreviewDepth(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem("previewDepth", String(newValue))
    }
  }, [previewDepth])

  const handleNodeSelect = (node) => {
    if (isCreatingEdge) {
      // Finish creating edge
      setIsCreatingEdge(false)
      // Logic to create edge between sourceNode and node
    } else {
      setSelectedNode(node === selectedNode ? null : node)
    }
  }

  const handleMultiSelect = (node) => {
    setMultiSelectedNodes((prev) => {
      if (prev.includes(node)) {
        return prev.filter((n) => n !== node)
      } else {
        return [...prev, node]
      }
    })
  }

  const startEdgeCreation = (node) => {
    setSourceNode(node)
    setIsCreatingEdge(true)
  }

  const handleEmptySpaceClick = (position) => {
    if (isCreatingEdge) {
      setNodeCreationPosition(position)
      setShowNodeCreationPanel(true)
    } else {
      setSelectedNode(null)
      setMultiSelectedNodes([])
    }
  }

  const createNewNode = (type) => {
    // Logic to create a new node at nodeCreationPosition
    setShowNodeCreationPanel(false)
    setIsCreatingEdge(false)
  }

  const synthesizeNodes = () => {
    if (multiSelectedNodes.length >= 2) {
      // Logic to create a synthesis node
      setMultiSelectedNodes([])
    }
  }

  return (
    <div
      className={`relative w-full h-full ${previewDepth ? "rf-parallax-wrapper" : "preview-depth-off"}`}
      onMouseMove={handleMouseMove}
      style={{ perspective: "800px" }}
    >
      <Canvas shadows gl={{ antialias: true }}>
        <color attach="background" args={["#0A0814"]} />
        <fog attach="fog" args={["#0A0814", 30, 100]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {firstPersonMode ? (
          <FirstPersonCamera />
        ) : (
          <>
            <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={60} />
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={0.5}
              panSpeed={0.5}
              zoomSpeed={0.5}
              minDistance={5}
              maxDistance={100}
            />
          </>
        )}

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {showGrid && <AdaptiveGrid />}

        <GalaxyScene
          selectedNode={selectedNode}
          multiSelectedNodes={multiSelectedNodes}
          onNodeSelect={handleNodeSelect}
          onMultiSelect={handleMultiSelect}
          onStartEdgeCreation={startEdgeCreation}
          onEmptySpaceClick={handleEmptySpaceClick}
          isCreatingEdge={isCreatingEdge}
          sourceNode={sourceNode}
          edgeEndPosition={edgeEndPosition}
          setEdgeEndPosition={setEdgeEndPosition}
          previewDepth={previewDepth}
        />
      </Canvas>

      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={toggleFirstPersonMode}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {firstPersonMode ? "Exit First Person" : "Enter First Person"}
        </button>

        <button
          onClick={togglePreviewDepth}
          className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          {previewDepth ? "Disable Depth" : "Enable Depth"}
        </button>

        {multiSelectedNodes.length >= 2 && (
          <button
            onClick={synthesizeNodes}
            className="px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Ignite Synthesis
          </button>
        )}
      </div>

      {selectedNode && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <NodeInfo node={selectedNode} />
        </div>
      )}

      {showNodeCreationPanel && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <NodeCreationPanel onSelect={createNewNode} onCancel={() => setShowNodeCreationPanel(false)} />
        </div>
      )}

      <ControlPanel />
    </div>
  )
}

function FirstPersonCamera() {
  const { camera } = useThree()
  const controls = useControls()
  const positionRef = useRef(new THREE.Vector3(0, 0, 30))

  useFrame((state, delta) => {
    // WASD movement
    const speed = controls.shift ? 20 : 10
    const moveSpeed = speed * delta

    // Update our position reference instead of directly modifying camera
    if (controls.w) positionRef.current.z -= moveSpeed * Math.cos(camera.rotation.y)
    if (controls.s) positionRef.current.z += moveSpeed * Math.cos(camera.rotation.y)
    if (controls.a) positionRef.current.x -= moveSpeed
    if (controls.d) positionRef.current.x += moveSpeed
    if (controls.space) positionRef.current.y += moveSpeed
    if (controls.ctrl) positionRef.current.y -= moveSpeed

    // Apply the position to the camera
    camera.position.copy(positionRef.current)
  })

  return null
}

function GalaxyScene({
  selectedNode,
  multiSelectedNodes,
  onNodeSelect,
  onMultiSelect,
  onStartEdgeCreation,
  onEmptySpaceClick,
  isCreatingEdge,
  sourceNode,
  edgeEndPosition,
  setEdgeEndPosition,
  previewDepth,
}) {
  const { nodes, edges } = useNodeData()
  const { raycaster, camera, mouse, scene, viewport } = useThree()
  const zoom = viewport.factor || 1

  const arrowsRef = useRef([])
  const arrowPositionsRef = useRef([])

  // Initialize arrow positions
  const initializeArrowPositions = useCallback(() => {
    arrowPositionsRef.current = Array(3)
      .fill(null)
      .map(() => new THREE.Vector3())
  }, [])

  // Call initializeArrowPositions unconditionally
  initializeArrowPositions()

  useFrame(() => {
    if (isCreatingEdge && sourceNode) {
      // Update the end position of the edge being created
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)

      if (intersects.length > 0) {
        setEdgeEndPosition(intersects[0].point.toArray())
      } else {
        // If no intersection, project to a point in space
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
        vector.unproject(camera)
        const dir = vector.sub(camera.position).normalize()
        const distance = 20
        const pos = camera.position.clone().add(dir.multiplyScalar(distance))
        setEdgeEndPosition(pos.toArray())
      }
    }
  })

  const handleBackgroundClick = (e) => {
    if (e.object.userData.isBackground) {
      onEmptySpaceClick(e.point.toArray())
    }
  }

  return (
    <group>
      {/* Invisible background plane for detecting clicks in empty space */}
      <mesh
        position={[0, 0, -50]}
        rotation={[0, 0, 0]}
        scale={[1000, 1000, 1]}
        onClick={handleBackgroundClick}
        visible={false}
        userData={{ isBackground: true }}
      >
        <planeGeometry />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Nodes */}
      {nodes.map((node) => (
        <KnowledgeNode
          key={node.id}
          node={node}
          isSelected={selectedNode?.id === node.id}
          isMultiSelected={multiSelectedNodes.includes(node)}
          onClick={(e) => {
            e.stopPropagation()
            if (e.shiftKey) {
              onMultiSelect(node)
            } else {
              onNodeSelect(node)
            }
          }}
          onShiftClick={() => onStartEdgeCreation(node)}
          previewDepth={previewDepth}
          zoom={zoom}
        />
      ))}

      {/* Edges */}
      {edges.map((edge) => {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)

        // Only render edge if both source and target nodes exist and have valid positions
        if (source && target && source.position && target.position) {
          return (
            <KnowledgeEdge
              key={edge.id}
              edge={edge}
              sourceNode={source}
              targetNode={target}
              arrowsRef={arrowsRef}
              arrowPositionsRef={arrowPositionsRef}
            />
          )
        }
        return null
      })}

      {/* Edge being created */}
      {isCreatingEdge && sourceNode && (
        <CreatingEdge start={nodes.find((n) => n.id === sourceNode.id)?.position} end={edgeEndPosition} />
      )}
    </group>
  )
}

function KnowledgeNode({ node, isSelected, isMultiSelected, onClick, onShiftClick, previewDepth, zoom }) {
  const haloRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [floatOffset, setFloatOffset] = useState(0)
  const floatOffsetRef = useRef(0) // Use a ref to hold the floatOffset value

  // Validate node data
  if (!node || !node.position) {
    return null
  }

  // Calculate the depth adjustment based on zoom level
  const baseDepth = node.depth || 0
  const baseScale = 1
  const adjustedZ = previewDepth ? baseDepth * baseScale * (1 / zoom) : 0

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Update the float offset state instead of directly modifying position
    floatOffsetRef.current = Math.sin(t * 0.5 + node.id * 0.3) * 0.1

    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.2
      haloRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.05)
    }
  })

  // Node color based on archetype
  const getNodeColor = (type) => {
    switch (type) {
      case "CONCEPT":
        return "#c8a2e0" // lavender
      case "THINKER":
        return "#3060a0" // ultramarine
      case "AXIOM":
        return "#f0d080" // pale gold
      case "SYNTHESIS":
        return "#e060a0" // magenta
      case "ARCHETYPE":
      case "SYMBOL":
      case "MYTH":
        return "#60e0c0" // cyan/teal
      default:
        return "#a0a0a0" // neutral gray
    }
  }

  const nodeColor = getNodeColor(node.type)

  // Calculate the final position with the float offset and depth
  const nodePosition = useMemo(() => {
    if (!node.position || !Array.isArray(node.position) || node.position.length < 3) {
      return [0, 0, 0]
    }
    const [x, y, z] = node.position
    return [isNaN(x) ? 0 : x, isNaN(y) ? 0 : y + floatOffsetRef.current, isNaN(z) ? 0 : z + adjustedZ]
  }, [node.position, adjustedZ])

  // Determine core glow state based on selection
  const getCoreGlowColor = () => {
    if (isSelected) return "#ffffff" // Bright white/cyan
    if (isMultiSelected) return "#ffd700" // Pulsing amber/gold
    if (hovered) return "#a0a0ff" // Cool blue/purple
    return "#606080" // Dim idle state
  }

  const coreGlowColor = getCoreGlowColor()
  const coreGlowIntensity = isSelected || isMultiSelected ? 0.8 : hovered ? 0.5 : 0.3

  // Generate halo points
  const haloPoints = useMemo(() => {
    const radius = (node.size || 1) * 1.5
    return Array.from({ length: 64 }).map((_, i) => {
      const angle = (i / 64) * Math.PI * 2
      return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0]
    })
  }, [node.size])

  return (
    <group
      position={nodePosition}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Main node sphere */}
      <Sphere args={[node.size || 1, 32, 32]}>
        <meshStandardMaterial
          color={nodeColor}
          emissive={coreGlowColor}
          emissiveIntensity={coreGlowIntensity}
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      {/* Orbital ticks for importance */}
      {node.importance > 0 &&
        Array.from({ length: Math.min(5, Math.ceil(node.importance * 5)) }).map((_, i) => (
          <group key={i} rotation={[0, 0, i * ((Math.PI * 2) / 5)]}>
            <mesh position={[0, node.size * 1.5, 0]} scale={[0.1, 0.3, 0.1]}>
              <boxGeometry />
              <meshBasicMaterial color={nodeColor} transparent opacity={0.7} />
            </mesh>
          </group>
        ))}

      {/* Selection halo */}
      {(isSelected || isMultiSelected || hovered) && (
        <group ref={haloRef}>
          <Line
            points={haloPoints}
            color={isSelected ? "#ffffff" : isMultiSelected ? "#a040ff" : "#808080"}
            lineWidth={2}
          />
        </group>
      )}

      {/* Node label */}
      <Html distanceFactor={15}>
        <div className="px-2 py-1 bg-black/70 text-white text-xs rounded whitespace-nowrap">
          {node.label || node.name || "Unnamed Node"}
        </div>
      </Html>
    </group>
  )
}

function KnowledgeEdge({ edge, sourceNode, targetNode, arrowsRef, arrowPositionsRef }) {
  const curveRef = useRef()

  // Validate source and target nodes
  if (
    !sourceNode?.position ||
    !targetNode?.position ||
    !Array.isArray(sourceNode.position) ||
    !Array.isArray(targetNode.position) ||
    sourceNode.position.length < 3 ||
    targetNode.position.length < 3
  ) {
    return null
  }

  // Validate position values
  const sourcePos = sourceNode.position
  const targetPos = targetNode.position

  if (
    sourcePos.some((val) => val === undefined || val === null || isNaN(val)) ||
    targetPos.some((val) => val === undefined || val === null || isNaN(val))
  ) {
    return null
  }

  // Calculate curve points
  const points = useMemo(() => {
    try {
      const start = new THREE.Vector3(sourcePos[0], sourcePos[1], sourcePos[2])
      const end = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2])

      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)

      // Add some curve by offsetting the middle point
      const direction = new THREE.Vector3().subVectors(end, start)
      const perpendicular = new THREE.Vector3(-direction.y, direction.x, direction.z).normalize()
      mid.add(perpendicular.multiplyScalar(direction.length() * 0.2))

      // Create a smooth curve
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
      return Array.from({ length: 20 }).map((_, i) => curve.getPoint(i / 19))
    } catch (error) {
      console.error("Error generating curve points:", error)
      return []
    }
  }, [sourcePos, targetPos])

  // If we don't have valid points, don't render
  if (!points.length) {
    return null
  }

  // Get edge color based on semantic type
  const getEdgeColor = () => {
    if (!edge.semantic_type) return "#a0a0a0" // Default gray

    switch (edge.semantic_type) {
      case "IS":
        return "#c0c0c0" // Silver
      case "HAS":
        return "#c0c0c0" // Silver
      case "DEPENDS_ON":
        return "#6080a0" // Blue-gray
      case "CONTRASTS_WITH":
        return "#404060" // Dark indigo
      case "CONFLICTS_WITH":
        return "#a04040" // Muted red
      case "IMPLIES":
        return "#40a0c0" // Cyan
      case "EMERGES_FROM":
        return "#40a080" // Green-aqua
      case "TRANSFORMS_INTO":
        return "#a040a0" // Violet
      case "ALIGNS_WITH":
        return "#c0a040" // Gold
      case "SYMBOLIZES":
        return "#40c0c0" // Bright cyan
      case "CONTAINS_TENSION_WITHIN":
        return "#802020" // Dark red
      case "SEEKS":
        return "#c06040" // Amber
      default:
        return "#a0a0a0" // Neutral gray
    }
  }

  const edgeColor = getEdgeColor()

  // Get line style based on semantic type
  const getLineStyle = () => {
    if (!edge.semantic_type) return { lineWidth: 2, dashed: false }

    switch (edge.semantic_type) {
      case "IS":
        return { lineWidth: 3, dashed: false }
      case "HAS":
        return { lineWidth: 2, dashed: true, dashSize: 0.3, gapSize: 0.2 }
      case "CONTRASTS_WITH":
        return { lineWidth: 2, dashed: false }
      case "CONFLICTS_WITH":
        return { lineWidth: 2.5, dashed: false }
      case "SEEKS":
        return { lineWidth: 2, dashed: true, dashSize: 0.5, gapSize: 0.2 }
      default:
        return { lineWidth: 2, dashed: false }
    }
  }

  const lineStyle = getLineStyle()

  // Animate arrows along the edge
  useFrame((state) => {
    if (!curveRef.current || points.length === 0) return

    const t = state.clock.getElapsedTime() * 0.5

    arrowsRef.current.forEach((arrow, i) => {
      if (!arrow) return

      // Calculate position along the curve
      const offset = (t + i * 0.2) % 1
      const index = Math.floor(offset * (points.length - 1))
      const nextIndex = Math.min(index + 1, points.length - 1)
      const lerpFactor = (offset * (points.length - 1)) % 1

      // Update position in our ref
      const position = arrowPositionsRef.current[i]
      if (position && points[index] && points[nextIndex]) {
        position.lerpVectors(points[index], points[nextIndex], lerpFactor)

        // Set position using .set() instead of direct assignment
        arrow.position.set(position.x, position.y, position.z)

        // Calculate rotation to face the direction of travel
        if (nextIndex > index) {
          const direction = new THREE.Vector3().subVectors(points[nextIndex], points[index]).normalize()
          const lookAt = new THREE.Vector3().copy(position).add(direction)
          arrow.lookAt(lookAt)
        }
      }
    })
  })

  // Only show arrows for directed edge types
  const showArrows = ["DEPENDS_ON", "IMPLIES", "EMERGES_FROM", "TRANSFORMS_INTO", "SEEKS"].includes(edge.semantic_type)

  return (
    <group>
      {/* Edge tube */}
      <Line
        ref={curveRef}
        points={points}
        color={edgeColor}
        lineWidth={lineStyle.lineWidth}
        dashed={lineStyle.dashed}
        dashSize={lineStyle.dashSize}
        gapSize={lineStyle.gapSize}
        transparent
        opacity={0.6}
      />

      {/* Directional arrows */}
      {showArrows &&
        Array.from({ length: 3 }).map((_, i) => (
          <mesh key={i} ref={(el) => (arrowsRef.current[i] = el)} scale={[0.2, 0.2, 0.4]}>
            <coneGeometry args={[1, 2, 8]} />
            <meshBasicMaterial color={edgeColor} transparent opacity={0.8} />
          </mesh>
        ))}
    </group>
  )
}

function CreatingEdge({ start, end }) {
  // Validate start and end positions
  if (
    !start ||
    !end ||
    !Array.isArray(start) ||
    !Array.isArray(end) ||
    start.length < 3 ||
    end.length < 3 ||
    start.some((val) => val === undefined || val === null || isNaN(val)) ||
    end.some((val) => val === undefined || val === null || isNaN(val))
  ) {
    return null
  }

  // Calculate curve points
  const points = useMemo(() => {
    try {
      const startVec = new THREE.Vector3(start[0], start[1], start[2])
      const endVec = new THREE.Vector3(end[0], end[1], end[2])

      const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)

      // Add some curve
      const direction = new THREE.Vector3().subVectors(endVec, startVec)
      const perpendicular = new THREE.Vector3(-direction.y, direction.x, direction.z).normalize()
      mid.add(perpendicular.multiplyScalar(direction.length() * 0.2))

      const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec)
      return Array.from({ length: 20 }).map((_, i) => curve.getPoint(i / 19))
    } catch (error) {
      console.error("Error generating temporary edge points:", error)
      return []
    }
  }, [start, end])

  // If we don't have valid points, don't render
  if (!points.length) {
    return null
  }

  return (
    <Line points={points} color="#ffffff" lineWidth={2} transparent opacity={0.8} dashed dashSize={0.3} gapSize={0.1} />
  )
}
