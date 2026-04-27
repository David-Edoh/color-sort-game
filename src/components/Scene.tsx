import { Canvas, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { PresentationControls } from '@react-three/drei';
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
      camera.lookAt(0, 0, 0); // Center vertically
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
    <Canvas
      camera={{ position: [0, 4, 12], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <ResponsiveCamera cols={cols} spacingX={spacingX} />
      {/* Keep startup lighting synchronous so tubes render immediately. */}
      <ambientLight intensity={0.85} />
      <hemisphereLight intensity={0.6} groundColor="#c7d2fe" />
      <directionalLight position={[10, 12, 6]} intensity={1.25} />

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

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]}>
            <planeGeometry args={[24, 24]} />
            <meshStandardMaterial color="#dbe4f3" transparent opacity={0.2} />
          </mesh>
        </group>
      </PresentationControls>
    </Canvas>
  );
};
