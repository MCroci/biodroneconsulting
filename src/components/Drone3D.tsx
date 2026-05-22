import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Float } from '@react-three/drei';

interface Drone3DProps {
  bodyColor?: string;
  propColor?: string;
  armColor?: string;
}

export default function Drone3D({
  bodyColor = "#1E352F", // brand-dark
  propColor = "#FF7538", // brand-accent
  armColor = "#d1d5db" // gray-300
}: Drone3DProps) {
  const group = useRef<Group>(null);
  const prop1 = useRef<Group>(null);
  const prop2 = useRef<Group>(null);
  const prop3 = useRef<Group>(null);
  const prop4 = useRef<Group>(null);

  useFrame((state, delta) => {
    // Spin propellers very fast
    const propSpeed = 25;
    if (prop1.current) prop1.current.rotation.y += delta * propSpeed;
    if (prop2.current) prop2.current.rotation.y += delta * propSpeed;
    if (prop3.current) prop3.current.rotation.y += delta * propSpeed;
    if (prop4.current) prop4.current.rotation.y += delta * propSpeed;
    
    // Slight side to side sway
    if (group.current) {
        group.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float
      speed={1.5} // Animation speed
      rotationIntensity={0.2} // xyz rotation intensity
      floatIntensity={0.8} // Up/down float intensity
      floatingRange={[-0.2, 0.2]} // Range of y-axis values the object will float within
    >
      <group ref={group} dispose={null} scale={1.2} rotation={[0.4, -0.6, 0.15]}>
        {/* Core Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.3, 1.2]} />
          <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Top cover slightly elevated */}
        <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.6, 0.1, 0.8]} />
            <meshStandardMaterial color="#57A773" roughness={0.4} /> {/* brand-light */}
        </mesh>
        
        {/* Camera / Gimbal */}
        <mesh position={[0, -0.3, 0.4]} castShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#222" roughness={0.2} metalness={0.8} />
        </mesh>
        <mesh position={[0, -0.2, 0.4]} castShadow>
           <cylinderGeometry args={[0.04, 0.04, 0.2]} />
           <meshStandardMaterial color="#555" />
        </mesh>

        {/* Arms */}
        {/* Front Right */}
        <mesh position={[0.6, 0, 0.8]} rotation={[0, -Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.1]} />
          <meshStandardMaterial color={armColor} />
        </mesh>
        {/* Front Left */}
        <mesh position={[-0.6, 0, 0.8]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.1]} />
          <meshStandardMaterial color={armColor} />
        </mesh>
        {/* Back Right */}
        <mesh position={[0.6, 0, -0.8]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.1]} />
          <meshStandardMaterial color={armColor} />
        </mesh>
        {/* Back Left */}
        <mesh position={[-0.6, 0, -0.8]} rotation={[0, -Math.PI / 4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.1]} />
          <meshStandardMaterial color={armColor} />
        </mesh>

        {/* Motors and Propellers */}
        <group position={[0.9, 0.1, 1.1]}>
          <mesh position={[0, 0, 0]} castShadow>
             <cylinderGeometry args={[0.15, 0.15, 0.2]} />
             <meshStandardMaterial color="#333" />
          </mesh>
          <group ref={prop1} position={[0, 0.15, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.3, 0.02, 0.1]} />
              <meshStandardMaterial color={propColor} />
            </mesh>
          </group>
        </group>

        <group position={[-0.9, 0.1, 1.1]}>
          <mesh position={[0, 0, 0]} castShadow>
             <cylinderGeometry args={[0.15, 0.15, 0.2]} />
             <meshStandardMaterial color="#333" />
          </mesh>
          <group ref={prop2} position={[0, 0.15, 0]}>
             <mesh castShadow>
               <boxGeometry args={[1.3, 0.02, 0.1]} />
               <meshStandardMaterial color={propColor} />
             </mesh>
          </group>
        </group>

        <group position={[0.9, 0.1, -1.1]}>
          <mesh position={[0, 0, 0]} castShadow>
             <cylinderGeometry args={[0.15, 0.15, 0.2]} />
             <meshStandardMaterial color="#333" />
          </mesh>
          <group ref={prop3} position={[0, 0.15, 0]}>
             <mesh castShadow>
               <boxGeometry args={[1.3, 0.02, 0.1]} />
               <meshStandardMaterial color={propColor} />
             </mesh>
          </group>
        </group>

        <group position={[-0.9, 0.1, -1.1]}>
          <mesh position={[0, 0, 0]} castShadow>
             <cylinderGeometry args={[0.15, 0.15, 0.2]} />
             <meshStandardMaterial color="#333" />
          </mesh>
          <group ref={prop4} position={[0, 0.15, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.3, 0.02, 0.1]} />
              <meshStandardMaterial color={propColor} />
            </mesh>
          </group>
        </group>
      </group>
    </Float>
  );
}
