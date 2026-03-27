import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticlesProps {
  count: number
  spread: number
  color: string
  size: number
  speed: number
}

function Particles({ count, spread, color, size, speed }: ParticlesProps) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spread
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread
    }
    return arr
  }, [count, spread])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.4
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.6
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  )
}

export interface ParticleFieldProps {
  className?: string
  count?: number
  spread?: number
  color?: string
  size?: number
  speed?: number
}

export function ParticleField({
  className = '',
  count = 120,
  spread = 12,
  color = '#6366f1',
  size = 0.03,
  speed = 0.05,
}: ParticleFieldProps) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 6], fov: 70 }}>
        <ambientLight intensity={0.2} />
        <Particles count={count} spread={spread} color={color} size={size} speed={speed} />
      </Canvas>
    </div>
  )
}
