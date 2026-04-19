import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { Environment, ContactShadows, PresentationControls } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { Tube } from './Tube';

const ResponsiveCamera = ({ cols, spacingX }: { cols: number; spacingX: number }) => {
  const { camera, size } = useThree();
  
  useEffect(() => {
    const aspect = size.width / size.height;
    
    const gridWidth = (cols - 1) * spacingX;
    const requiredWidth = gridWidth + 3.5; 

    if ('fov' in camera) {
      const fovRad = (camera.fov * Math.PI) / 180;
      const neededZ = requiredWidth / (2 * Math.tan(fovRad / 2) * aspect);
      camera.position.z = Math.max(12, neededZ);
      camera.updateProjectionMatrix();
    }
  }, [size, camera, cols, spacingX]);
  
  return null;
};

export const Scene = () => {
  const tubes = useGameStore((state) => state.tubes);
  
  // Calculate responsive grid
  const count = tubes.length;
  // If count is up to 6, maybe one row. Otherwise two rows.
  const rows = count > 6 ? 2 : 1;
  const cols = Math.ceil(count / rows);
  
  const spacingX = 2.5;
  const spacingZ = 2.5;

  return (
    <Canvas camera={{ position: [0, 4, 12], fov: 45 }}>
      <ResponsiveCamera cols={cols} spacingX={spacingX} />
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Environment preset="city" />

      {/* Interactive Controls wrapper to let user look around slightly */}
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-0.1, 0.2]}
        azimuth={[-0.2, 0.2]}
      >
        <group position={[0, -2, 0]}>
          {tubes.map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            // Center the grid
            const xOffset = (cols - 1) * spacingX / 2;
            const zOffset = (rows - 1) * spacingZ / 2;
            
            const position: [number, number, number] = [
              col * spacingX - xOffset,
              0,
              -(row * spacingZ - zOffset) // push second row back
            ];

            return <Tube key={i} index={i} position={position} />;
          })}
          
          <ContactShadows position={[0, -0.2, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </group>
      </PresentationControls>
    </Canvas>
  );
};
