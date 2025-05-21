"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Stars, Environment, Text, Float } from "@react-three/drei"

export default function SpaceCatwalk() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas shadows>
        <fog attach="fog" args={["#070710", 10, 50]} />
        <Environment preset="night" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
        <Scene />
      </Canvas>
    </div>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.2} color="#0080ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#ff8000" />

      <Catwalk />
      <FloatingNodes />
      <Player />
    </>
  )
}

function Catwalk() {
  const walkwayLength = 100
  const walkwayWidth = 4

  return (
    <group>
      {/* Main walkway */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[walkwayWidth, walkwayLength]} />
        <meshStandardMaterial color="#111122" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Grid lines */}
      {Array.from({ length: walkwayLength / 2 + 1 }).map((_, i) => (
        <mesh key={`line-z-${i}`} position={[0, 0, -walkwayLength / 2 + i * 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[walkwayWidth, 0.05]} />
          <meshBasicMaterial color="#0066ff" transparent opacity={0.5} />
        </mesh>
      ))}

      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={`line-x-${i}`}
          position={[-walkwayWidth / 2 + i * (walkwayWidth / 2), 0, 0]}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
        >
          <planeGeometry args={[walkwayLength, 0.05]} />
          <meshBasicMaterial color="#0066ff" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Side rails */}
      <mesh position={[-walkwayWidth / 2, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, walkwayLength]} />
        <meshStandardMaterial color="#0066ff" emissive="#003399" emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>

      <mesh position={[walkwayWidth / 2, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, walkwayLength]} />
        <meshStandardMaterial color="#0066ff" emissive="#003399" emissiveIntensity={0.5} transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

function FloatingNodes() {
  const nodeTypes = [
    { name: "Ideas", color: "#ff3366", shape: "sphere" },
    { name: "People", color: "#33ff99", shape: "box" },
    { name: "Concepts", color: "#ff9933", shape: "tetrahedron" },
    { name: "Projects", color: "#3366ff", shape: "octahedron" },
    { name: "Memories", color: "#9933ff", shape: "dodecahedron" },
  ]

  return (
    <group>
      {nodeTypes.map((node, i) => (
        <Float
          key={i}
          speed={1.5}
          rotationIntensity={1}
          floatIntensity={2}
          position={[(Math.random() - 0.5) * 20, 2 + Math.random() * 5, (Math.random() - 0.5) * 40]}
        >
          <NodeObject type={node} />
        </Float>
      ))}

      {/* Generate additional random nodes */}
      {Array.from({ length: 15 }).map((_, i) => {
        const randomType = nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
        return (
          <Float
            key={`random-${i}`}
            speed={1}
            rotationIntensity={1}
            floatIntensity={2}
            position={[(Math.random() - 0.5) * 30, 2 + Math.random() * 8, (Math.random() - 0.5) * 60]}
          >
            <NodeObject type={randomType} />
          </Float>
        )
      })}
    </group>
  )
}

function NodeObject({ type }) {
  const getGeometry = () => {
    switch (type.shape) {
      case "sphere":
        return <sphereGeometry args={[1, 32, 32]} />
      case "box":
        return <boxGeometry args={[1.2, 1.2, 1.2]} />
      case "tetrahedron":
        return <tetrahedronGeometry args={[1.2]} />
      case "octahedron":
        return <octahedronGeometry args={[1.2]} />
      case "dodecahedron":
        return <dodecahedronGeometry args={[1]} />
      default:
        return <sphereGeometry args={[1, 32, 32]} />
    }
  }

  return (
    <group>
      <mesh>
        {getGeometry()}
        <meshStandardMaterial
          color={type.color}
          emissive={type.color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Text position={[0, -1.5, 0]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
        {type.name}
      </Text>
    </group>
  )
}

function Player() {
  const cameraRef = useRef()
  const [position, setPosition] = useState([0, 1.7, 20])
  const [rotation, setRotation] = useState([0, 0, 0])
  const keys = useRef({})
  const walkwayWidth = 4
  const walkwayLength = 100

  const { camera } = useThree()

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Set up mouse look controls
    const handleMouseMove = (e) => {
      setRotation([
        // Limit vertical look to prevent flipping
        Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotation[0] - e.movementY * 0.005)),
        rotation[1] - e.movementX * 0.005,
        0,
      ])
    }

    const handlePointerLockChange = () => {
      if (document.pointerLockElement === document.body) {
        document.addEventListener("mousemove", handleMouseMove)
      } else {
        document.removeEventListener("mousemove", handleMouseMove)
      }
    }

    document.addEventListener("pointerlockchange", handlePointerLockChange)

    const canvas = document.querySelector("canvas")
    canvas.addEventListener("click", () => {
      document.body.requestPointerLock()
    })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [rotation])

  useFrame((_, delta) => {
    // Update camera rotation
    camera.rotation.x = rotation[0]
    camera.rotation.y = rotation[1]

    // Calculate movement direction based on camera rotation
    const moveSpeed = 5 * delta
    let moveX = 0
    let moveZ = 0

    if (keys.current["w"]) {
      moveZ -= Math.cos(rotation[1]) * moveSpeed
      moveX -= Math.sin(rotation[1]) * moveSpeed
    }
    if (keys.current["s"]) {
      moveZ += Math.cos(rotation[1]) * moveSpeed
      moveX += Math.sin(rotation[1]) * moveSpeed
    }
    if (keys.current["a"]) {
      moveZ -= Math.sin(rotation[1]) * moveSpeed
      moveX += Math.cos(rotation[1]) * moveSpeed
    }
    if (keys.current["d"]) {
      moveZ += Math.sin(rotation[1]) * moveSpeed
      moveX -= Math.cos(rotation[1]) * moveSpeed
    }

    // Calculate new position
    let newX = position[0] + moveX
    let newZ = position[2] + moveZ

    // Constrain to walkway
    newX = Math.max(-walkwayWidth / 2 + 0.5, Math.min(walkwayWidth / 2 - 0.5, newX))
    newZ = Math.max(-walkwayLength / 2 + 0.5, Math.min(walkwayLength / 2 - 0.5, newZ))

    setPosition([newX, position[1], newZ])

    // Update camera position
    camera.position.set(newX, position[1], newZ)
  })

  return null
}
