import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

const TUBE_HEIGHT = 4;
const TUBE_RADIUS = 0.5;
const LAYER_HEIGHT = (TUBE_HEIGHT - 0.2) / 4; // leave slight padding
const RADIAL_SEGMENTS = 16;

const glassTubeGeometry = new THREE.CylinderGeometry(
  TUBE_RADIUS + 0.05,
  TUBE_RADIUS,
  TUBE_HEIGHT + 0.2,
  RADIAL_SEGMENTS,
  1,
  true,
);

const tubeBottomGeometry = new THREE.SphereGeometry(
  TUBE_RADIUS,
  RADIAL_SEGMENTS,
  12,
  0,
  Math.PI * 2,
  0,
  Math.PI / 2,
);

const liquidLayerGeometry = new THREE.CylinderGeometry(
  TUBE_RADIUS - 0.05,
  TUBE_RADIUS - 0.05,
  LAYER_HEIGHT,
  RADIAL_SEGMENTS,
);

const glassMaterial = new THREE.MeshStandardMaterial({
  color: '#f8fbff',
  transparent: true,
  opacity: 0.35,
  roughness: 0.15,
  metalness: 0.05,
  side: THREE.DoubleSide,
  depthWrite: false,
});

const liquidMaterialCache = new Map<string, THREE.MeshStandardMaterial>();

const getLiquidMaterial = (color: string) => {
  let material = liquidMaterialCache.get(color);

  if (!material) {
    material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.08,
    });
    liquidMaterialCache.set(color, material);
  }

  return material;
};

interface TubeProps {
  index: number;
  position: [number, number, number];
}

export const Tube = ({ index, position }: TubeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
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
      <mesh position={[0, TUBE_HEIGHT / 2, 0]} geometry={glassTubeGeometry} material={glassMaterial} />
      
      {/* Tube Bottom (closed) */}
      <mesh position={[0, -0.1, 0]} geometry={tubeBottomGeometry} material={glassMaterial} />

      {/* Liquid Layers */}
      <group>
        {tubeState.map((color, i) => {
          // Bottom alignment: layer goes from y=0 up
          const yPos = (i * LAYER_HEIGHT) + LAYER_HEIGHT / 2 + 0.1;
          return (
            <mesh
              key={`${color}-${i}`}
              position={[0, yPos, 0]}
              geometry={liquidLayerGeometry}
              material={getLiquidMaterial(color)}
            />
          );
        })}
      </group>
    </group>
  );
};
