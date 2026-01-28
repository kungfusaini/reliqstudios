// Test to verify old vs new scale factor calculation

const testViewports = [300, 600, 900, 1200]
const scale_factor = 0.0005
const base_viewport = 600
const baseSize = 3

console.log("Testing scale factor calculation:")
console.log("scale_factor:", scale_factor)
console.log("base_viewport:", base_viewport)
console.log("baseSize:", baseSize)
console.log("")

console.log("Old formula: viewportRatio + (scale_factor * viewport.width)")
console.log("New formula: viewportRatio + (scale_factor * viewport.width)")
console.log("(They should be identical)")
console.log("")

for (const viewportWidth of testViewports) {
  const viewportRatio = viewportWidth / base_viewport
  const scaleComponent = scale_factor * viewportWidth
  const dynamicMultiplier = viewportRatio + scaleComponent
  const clampedMultiplier = Math.max(0.3, Math.min(2.0, dynamicMultiplier))
  const finalSize = baseSize * clampedMultiplier
  
  console.log(`Viewport: ${viewportWidth}px`)
  console.log(`  viewportRatio: ${viewportWidth}/${base_viewport} = ${viewportRatio.toFixed(2)}`)
  console.log(`  scaleComponent: ${scale_factor} × ${viewportWidth} = ${scaleComponent.toFixed(3)}`)
  console.log(`  dynamicMultiplier: ${viewportRatio.toFixed(2)} + ${scaleComponent.toFixed(3)} = ${dynamicMultiplier.toFixed(3)}`)
  console.log(`  clampedMultiplier: max(0.3, min(2.0, ${dynamicMultiplier.toFixed(3)})) = ${clampedMultiplier.toFixed(3)}`)
  console.log(`  finalSize: ${baseSize} × ${clampedMultiplier.toFixed(3)} = ${finalSize.toFixed(2)}px`)
  console.log("")
}