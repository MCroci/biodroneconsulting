import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import Drone3D from './Drone3D';

interface Hero3DProps {
  droneBodyColor?: string;
  dronePropColor?: string;
  droneArmColor?: string;
  /** Skip the HDRI environment map (reflections). Defaults to true. */
  environment?: boolean;
}

export default function Hero3DBackground({ droneBodyColor, dronePropColor, droneArmColor, environment = true }: Hero3DProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={35} />
        <ambientLight intensity={0.6} />
        <directionalLight
            position={[10, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          <Drone3D bodyColor={droneBodyColor} propColor={dronePropColor} armColor={droneArmColor} />
          {environment && <Environment preset="city" />}
        </Suspense>
      </Canvas>
    </div>
  );
}
