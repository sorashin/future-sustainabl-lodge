import * as THREE from 'three'
import React, { Suspense, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useSpring, config } from '@react-spring/core'
import { a } from '@react-spring/three'
import { a as aDom } from '@react-spring/web'
import { EffectComposer, SSAO, SMAA } from 'react-postprocessing'
import Text from './helpers/Text'
import useModel from './helpers/useModel'
import useYScroll from './helpers/useYScroll'
import './styles.css'

const material = { transparent: true, roughness: 0.8, fog: true, shininess: 0, flatShading: false }

const Seat = ({ color, ...props }) => {
  const [geometries, center] = useModel('/seat.glb')
  const [hovered, set] = useState(false)
  const hover = (e) => e.stopPropagation() && set(true)
  const unhover = () => set(false)
  const { scale } = useSpring({ scale: hovered ? 1.2 : 1, config: config.stiff })
  return (
    <a.group {...props} onPointerOver={hover} onPointerOut={unhover} scale={scale.to((s) => [s, s, 1])}>
      {geometries.map((geom) => (
        <mesh key={geom.uuid} position={center} geometry={geom} castShadow receiveShadow>
          <meshPhysicalMaterial {...material} roughness={1} shininess={0} color={color} />
        </mesh>
      ))}
    </a.group>
  )
}

const Quarter = ({ color, ...props }) => (
  <group {...props}>
    <Seat color={color} position={[-0.35, 0, 0.7]} />
    <Seat color={color} position={[0.35, 0, 0.7]} />
    <Seat color={color} position={[-0.35, 0, -0.7]} rotation={[0, Math.PI, 0]} />
    <Seat color={color} position={[0.35, 0, -0.7]} rotation={[0, Math.PI, 0]} />
  </group>
)

const Row = ({ color, ...props }) => (
  <group {...props}>
    <Text color="gray" size={0.15} position={[2.2, 2, 10.8]} rotation={[-Math.PI / 2, 0, 0]} children="1" />
    <Text color="gray" size={0.15} position={[2.2, 2, 10]} rotation={[-Math.PI / 2, 0, 0]} children="2" />
    <Text color="gray" size={0.15} position={[-2.2, 2, 10.8]} rotation={[-Math.PI / 2, 0, 0]} children="1" />
    <Text color="gray" size={0.15} position={[-2.2, 2, 10]} rotation={[-Math.PI / 2, 0, 0]} children="2" />
    <Quarter color={color} position={[-1.2, -0.45, 9.75]} />
    <Quarter color={color} position={[1.2, -0.45, 9.75]} />
  </group>
)

const Cabin = ({ color = 'white', seatColor = 'white', name, ...props }) => {
  const [geometries, center] = useModel('/cabin.glb')
  return (
    <group {...props}>
      <Text centerX={false} color="lightcoral" size={0.6} position={[2.6, 2, 10.6]} rotation={[-Math.PI / 2, 0, 0]}>
        {name}
      </Text>
      <group position={center}>
        {geometries.map((geom, index) => (
          <mesh key={geom.uuid} geometry={geom} castShadow receiveShadow>
            <meshPhysicalMaterial {...material} color={index === 0 ? color : 'indianred'} opacity={index === 0 ? 1 : 0.2} />
          </mesh>
        ))}
      </group>
      <Row color={seatColor} />
      <Row color={seatColor} position={[0, 0, -1.9]} />
      <Row color={seatColor} position={[0, 0, -6.6]} />
      <Row color={seatColor} position={[0, 0, -8.5]} />
      <Row color={seatColor} position={[0, 0, -11]} />
      <Row color={seatColor} position={[0, 0, -12.9]} />
      <Row color={seatColor} position={[0, 0, -17.6]} />
      <Row color={seatColor} position={[0, 0, -19.5]} />
    </group>
  )
}

export default function App() {
  const [y] = useYScroll([-100, 2400], { domTarget: window })
  return (
    <>
      <Canvas concurrent invalidateFrameloop shadowMap camera={{ position: [0, 5, 10], fov: 65, near: 2, far: 60 }} gl={{ alpha: false }}>
        <color attach="background" args={['white']} />
        <fog attach="fog" args={['white', 20, 40]} />
        <ambientLight intensity={0.4} />
        <spotLight
          castShadow
          angle={Math.PI / 8}
          intensity={0.2}
          position={[20, 30, 20]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
          <planeGeometry args={[4, 1000]} />
          <meshBasicMaterial color="lightcoral" fog={false} transparent opacity={0.4} />
        </mesh>
        <Suspense fallback={null}>
          <a.group position-z={y.to((y) => (y / 500) * 25)}>
            <Cabin color="white" seatColor="lightskyblue" name="1A" position={[0, 0, -6]} />
            <Cabin color="lightgray" seatColor="gray" name="2B" position={[0, 0, -32]} />
            <Cabin color="white" seatColor="lightskyblue" name="3A" position={[0, 0, -58]} />
            <Cabin color="lightgray" seatColor="gray" name="4B" position={[0, 0, -84]} />
            <Cabin color="#676767" seatColor="sandybrown" name="5B" position={[0, 0, -110]} />
          </a.group>
          <EffectComposer multisampling={0}>
            <SSAO
              intensity={40}
              luminanceInfluence={0.2}
              radius={8}
              scale={0.5}
              bias={0.5}
              distanceThreshold={0.5}
              distanceFalloff={0.03}
              rangeFalloff={0.001}
            />
            <SMAA />
          </EffectComposer>
        </Suspense>
      </Canvas>
      <aDom.div className="bar" style={{ height: y.interpolate([-100, 2400], ['0%', '100%']) }} />
    </>
  )
}
