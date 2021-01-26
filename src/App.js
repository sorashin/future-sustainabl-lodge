// import * as THREE from 'three'
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
import { Controls,  withControls } from 'react-three-gui'

const material = { transparent: true, roughness: 0.8, fog: true, shininess: 0, flatShading: false }
const MyCanvas = withControls(Canvas);

const Stage = ({color, ...props})=>{
  const [geometries, center] = useModel('/stage.glb')
  // const [geometries_sample, center_sample] = useModel('/seat.glb')
  
  return (
    <a.group {...props} >
      {geometries.map((geom) => (
        <mesh key={geom.uuid} position={center} geometry={geom} castShadow receiveShadow rotation={[-Math.PI/2, Math.PI, Math.PI/2]}>
          <meshStandardMaterial {...material} roughness={1} shininess={0} color={color} />
        </mesh>
      ))}
    </a.group>
  )
}

const Shoes = ({ color, ...props }) => {
  const [geometries, center] = useModel('/shoes.glb')
  const [hovered, setHover] = useState(false)
  const hover = (e) => {
    e.stopPropagation()
    setHover(true)
  }
  const unhover = () => setHover(false)
  const { scale } = useSpring({ scale: hovered ? 1.2 : 1, config: config.stiff })
  return (
    <a.group {...props} onPointerOver={hover} onPointerOut={unhover} scale={scale.to((s) => [s, s, 1])}>
      {geometries.map((geom) => (
        <mesh key={geom.uuid} position={center} geometry={geom} castShadow receiveShadow rotation={[-Math.PI/2, Math.PI, 0]}>  
          <meshPhysicalMaterial {...material} roughness={1} shininess={0} color={color} />
        </mesh>
      ))}
    </a.group>
  )
}


// const Seat = ({ color, ...props }) => {
//   const [geometries, center] = useModel('/seat.glb')
//   const [hovered, set] = useState(false)
//   const hover = (e) => e.stopPropagation() && set(true)
//   const unhover = () => set(false)
//   const { scale } = useSpring({ scale: hovered ? 1.2 : 1, config: config.stiff })
//   return (
//     <a.group {...props} onPointerOver={hover} onPointerOut={unhover} scale={scale.to((s) => [s, s, 1])}>
//       {geometries.map((geom) => (
//         <mesh key={geom.uuid} position={center} geometry={geom} castShadow receiveShadow> 
//           <meshPhysicalMaterial {...material} roughness={1} shininess={0} color={color} />
//         </mesh>
//       ))}
//     </a.group>
//   )
// }

const Quarter = ({ color, ...props }) => (
  <group {...props}>
    {/* <Shoes color={color} position={[-0.35, -2, 0.7]} />
    <Shoes color={color} position={[0.35, -2, 0.7]} /> */}
    <Shoes color={color} position={[-0.35, -2, -0.7]} rotation={[0, Math.PI, 0]} />
    <Shoes color={color} position={[0.35, -2, -0.7]} rotation={[0, Math.PI, 0]} />
  </group>
)

const Row = ({ color, ...props }) => (
  <group {...props}>
    <Text color="gray" size={0.15} position={[2.2, 2, 10.8]} rotation={[-Math.PI / 2, 0, 0]} children="1" />
    <Text color="gray" size={0.15} position={[2.2, 2, 10]} rotation={[-Math.PI / 2, 0, 0]} children="2" />
    <Text color="gray" size={0.15} position={[-2.2, 2, 10.8]} rotation={[-Math.PI / 2, 0, 0]} children="1" />
    <Text color="gray" size={0.15} position={[-2.2, 2, 10]} rotation={[-Math.PI / 2, 0, 0]} children="2" />
    <Quarter color={color} position={[-1.6, -0.45, 9.75]} />
    <Quarter color={color} position={[1.6, -0.45, 9.75]} />
  </group>
)

const Cabin = ({ color = 'white', seatColor = 'white', name, ...props }) => {
  // const [geometries, center] = useModel('/cabin.glb')
  return (
    <group {...props}>
      <Text centerX={false} color="lightcoral" size={0.6} position={[2.6, 2, 10.6]} rotation={[-Math.PI / 2, 0, 0]}>
        {name}
      </Text>
      {/* <group position={center}>
        {geometries.map((geom, index) => (
          <mesh key={geom.uuid} geometry={geom} castShadow receiveShadow>
            <meshPhysicalMaterial {...material} color={index === 0 ? color : 'indianred'} opacity={index === 0 ? 1 : 0.2} />
          </mesh>
        ))}
      </group> */}
      <Row color={seatColor} />
      {/* <Row color={seatColor} position={[0, 0, -1.9]} />
      <Row color={seatColor} position={[0, 0, -6.6]} />
      <Row color={seatColor} position={[0, 0, -8.5]} />
      <Row color={seatColor} position={[0, 0, -11]} />
      <Row color={seatColor} position={[0, 0, -12.9]} />
      <Row color={seatColor} position={[0, 0, -17.6]} />
      <Row color={seatColor} position={[0, 0, -19.5]} /> */}
    </group>
  )
}

// const ShowCase = ({ color = 'white', seatColor = 'white', name, ...props }) => {
//   const [geometries, center] = useModel('/seat.glb')
//   return (
//     <group position={center}>
//         {geometries.map((geom, index) => (
//           <mesh key={geom.uuid} geometry={geom} castShadow receiveShadow>
//             <meshPhysicalMaterial {...material} color={index === 0 ? color : 'indianred'} opacity={index === 0 ? 1 : 0.2} />
//           </mesh>
//         ))}
//     </group>
//   )
// }

export default function App() {
  const [y] = useYScroll([-100, 200], { domTarget: window })
  // const positionX = useControl('Position', { type: 'number', distance: 1 });
  

  return (
    <Controls.Provider>
      <MyCanvas concurrent invalidateFrameloop shadowMap camera={{ position: [0, 5, 10], fov: 65, near: 2, far: 60 }} gl={{ alpha: false }}>
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
          <a.group position-z= {y.to((y) => (y / 500) * 25)}>
            <Cabin color="white" seatColor="lightskyblue" name="1A" position={[0, 0, 0]} />
            <Cabin color="lightgray" seatColor="gray" name="2B" position={[0, 0, -3]} />
            <Cabin color="white" seatColor="lightskyblue" name="3A" position={[0, 0, -6]} />
            <Cabin color="lightgray" seatColor="gray" name="4B" position={[0, 0, -9]} />
            <Cabin color="#676767" seatColor="sandybrown" name="5B" position={[0, 0, -12]} />
            <Stage color="lightskyblue" position={[0, 0, -6]} />
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
            {/* <ShowCase/> */}
          </EffectComposer>
        </Suspense>
      </MyCanvas>
      <Controls />
      <aDom.div className="bar" style={{ height: y.interpolate([-100, 200], ['0%', '100%']) }} />
    </Controls.Provider>
  )
}
