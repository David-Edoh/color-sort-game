import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

const TUBE_HEIGHT = 4;
const TUBE_RADIUS = 0.5;
const LAYER_HEIGHT = (TUBE_HEIGHT - 0.2) / 4; // leave slight padding

interface TubeProps {
  index: number;
  position: [number, number, number];
}

export const Tube = ({ index, position }: TubeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const liquidGroupRef = useRef<THREE.Group>(null);
  
  const tubeState = useGameStore((state) => state.tubes[index]);
  const selectedTube = useGameStore((state) => state.selectedTube);
  const selectTube = useGameStore((state) => state.selectTube);
  
  const isSelected = selectedTube === index;

  // Animate the tube (selection elevate and tilt)
  useFrame((_state, delta) => {
    if (groupRef.current) {
      const targetY = position[1] + (isSelected ? 1.5 : 0);
      const targetRotZ = isSelected ? 0.2 : 0;
      
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 10);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, delta * 10);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position} 
      onClick={(e) => { e.stopPropagation(); selectTube(index); }}
    >
      {/* Glass Tube */}
      <mesh position={[0, TUBE_HEIGHT / 2, 0]}>
        <cylinderGeometry args={[TUBE_RADIUS + 0.05, TUBE_RADIUS + 0.0, TUBE_HEIGHT + 0.2, 32, 1, true]} />
        <meshPhysicalMaterial 
          transmission={1} 
          roughness={0.1} 
          thickness={0.5} 
          color="#ffffff" 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Tube Bottom (closed) */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[TUBE_RADIUS, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial 
          transmission={1} 
          roughness={0.1} 
          thickness={0.5} 
          color="#ffffff" 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Liquid Layers */}
      <group ref={liquidGroupRef}>
        {tubeState.map((color, i) => {
          // Bottom alignment: layer goes from y=0 up
          const yPos = (i * LAYER_HEIGHT) + LAYER_HEIGHT / 2 + 0.1;
          return (
            <mesh key={`${color}-${i}`} position={[0, yPos, 0]}>
              <cylinderGeometry args={[TUBE_RADIUS - 0.05, TUBE_RADIUS - 0.05, LAYER_HEIGHT, 32]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
};
