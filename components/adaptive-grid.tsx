"use client"

import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Grid } from "@react-three/drei"
import * as THREE from "three"

export function AdaptiveGrid() {
  const gridRef = useRef()
  const { camera } = useThree()

  useFrame(() => {
    if (gridRef.current) {
      // Adjust grid size based on camera distance
      const distance = camera.position.length()
      const size = Math.max(50, distance * 2)
      gridRef.current.scale.set(size, size, 1)

      // Adjust grid divisions based on zoom level
      const divisions = Math.max(10, Math.min(50, Math.floor(20 * (50 / distance))))
      gridRef.current.userData.divisions = divisions

      // Adjust grid opacity based on camera angle
      const gridNormal = new THREE.Vector3(0, 0, 1)
      const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      const dot = gridNormal.dot(cameraDirection)
      const opacity = Math.pow(Math.abs(dot), 0.5) * 0.5

      gridRef.current.material.opacity = opacity
    }
  })

  return (
    <Grid
      ref={gridRef}
      args={[100, 100]}
      cellSize={1}
      cellThickness={0.3}
      cellColor="#404040"
      sectionSize={10}
      sectionThickness={0.5}
      sectionColor="#606060"
      fadeDistance={100}
      fadeStrength={1}
      position={[0, 0, -0.01]}
      rotation={[Math.PI / 2, 0, 0]}
    />
  )
}
