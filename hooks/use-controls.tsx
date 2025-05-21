"use client"

import { useState, useEffect } from "react"

export function useControls() {
  const [keys, setKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false,
    ctrl: false,
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (key === "w" || key === "a" || key === "s" || key === "d") {
        setKeys((prev) => ({ ...prev, [key]: true }))
      } else if (key === "shift") {
        setKeys((prev) => ({ ...prev, shift: true }))
      } else if (key === " ") {
        setKeys((prev) => ({ ...prev, space: true }))
        e.preventDefault() // Prevent page scrolling
      } else if (key === "control") {
        setKeys((prev) => ({ ...prev, ctrl: true }))
      }
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (key === "w" || key === "a" || key === "s" || key === "d") {
        setKeys((prev) => ({ ...prev, [key]: false }))
      } else if (key === "shift") {
        setKeys((prev) => ({ ...prev, shift: false }))
      } else if (key === " ") {
        setKeys((prev) => ({ ...prev, space: false }))
      } else if (key === "control") {
        setKeys((prev) => ({ ...prev, ctrl: false }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  return keys
}
