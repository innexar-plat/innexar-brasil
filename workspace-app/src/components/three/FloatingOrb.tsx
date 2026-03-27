import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface OrbProps {
  color?: string
  distort?: number
  speed?: number
}

function AnimatedOrb({ color = '#4338ca', distort = 0.45, speed = 2.5 }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
  })
  return (
    <Sphere ref={meshRef} args={[1.6, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed}
        roughness={0.1}
        metalness={0.6}
        opacity={0.85}
        transparent
      />
    </Sphere>
  )
}

function FloatingParticles({ count = 80, spread = 9 }: { count?: number; spread?: number }) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * spread
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread
  }
  const ref = useRef<THREE.Points>(null)
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.04
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#6366f1" size={0.04} transparent opacity={0.55} />
    </points>
  )
}

export interface FloatingOrbProps {
  className?: string
  orbColor?: string
  distort?: number
}

export function FloatingOrb({ className = '', orbColor = '#4338ca', distort = 0.45 }: FloatingOrbProps) {
  return (
    <div className={`pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#6366f1" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#22d3ee" />
        <AnimatedOrb color={orbColor} distort={distort} />
        <FloatingParticles />
      </Canvas>
    </div>
  )
}
