export default function Instructions() {
  return (
    <div className="fixed top-0 left-0 p-4 bg-black/70 text-white rounded-br-lg z-10">
      <h2 className="text-lg font-bold mb-2">Controls:</h2>
      <ul className="space-y-1 text-sm">
        <li>W - Move forward</li>
        <li>S - Move backward</li>
        <li>A - Move left</li>
        <li>D - Move right</li>
        <li>Mouse - Look around</li>
        <li>Click on the scene to enable mouse look</li>
      </ul>
    </div>
  )
}
