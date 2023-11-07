'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Center,
  Lightformer,
  Shadow,
} from '@react-three/drei'
import { ReactNode, useRef, useState } from 'react'
import { Model } from './Apple'

type Props = {
  position?: [number, number, number]
  fov?: number
}

export const Apple3D = ({ position = [0, 1, 2.5], fov = 7 }: Props) => {
  // 低パフォーマンス下で環境マップのレンダリング回数を1回に制御する
  const [perfSucks, degrade] = useState(true)

  return (
    <Canvas
      shadows
      camera={{ position, fov }}
      gl={{ preserveDrawingBuffer: true }}
      eventPrefix="client"
    >
      <Env perfSucks={perfSucks} />
      <CameraRig>
        <Center>
          <Model scale={0.5} />
          <Shadow
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.2}
            position={[0, 0, 0]}
            color={'black'}
            opacity={0.9}
          />
        </Center>
      </CameraRig>
    </Canvas>
  )
}

type EnvProps = {
  perfSucks: boolean
}

function Env({ perfSucks }: EnvProps) {
  return (
    <Environment
      frames={perfSucks ? 1 : Infinity}
      preset="sunset"
      resolution={256}
      background
      blur={0.8}
    >
      <Lightformer
        intensity={9}
        form="ring"
        color="#FF624F" // ライトの色
        rotation-y={Math.PI / 2}
        position={[-5, 2, -1]}
        scale={[10, 10, 1]}
      />
    </Environment>
  )
}

type RigType = {
  children: ReactNode
}

function CameraRig({ children }: RigType) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (groupRef.current) {
      // 経過時間に応じてカメラを回転させる
      const rotationY = (Math.sin(state.clock.elapsedTime * 0.8) * Math.PI) / 2
      groupRef.current.rotation.y = rotationY
    }
  })
  return <group ref={groupRef}>{children}</group>
}
