import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { addScore } from '../../lib/store';

// Componente para o nosso cubo interativo
function InteractiveCube() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Animação simples: gira o cubo a cada frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  // Função chamada quando o cubo é clicado
  const handleClick = () => {
    // Chama a ação do nosso store para adicionar um ponto
    addScore(0);
  };

  return (
    <mesh ref={meshRef} onClick={handleClick}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={"#7c3aed"} />
    </mesh>
  );
}

// O componente principal da cena 3D
export default function GameCanvas() {
  return (
    <Canvas>
      {/* Luzes para que possamos ver o cubo */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* O cubo interativo */}
      <InteractiveCube />

      {/* Controles de câmera para o usuário poder girar, dar zoom, etc. */}
      <OrbitControls />
    </Canvas>
  );
}