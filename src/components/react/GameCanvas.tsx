// src/components/react/GameCanvas.tsx

// AJUSTE: Adicionamos `useRef` e `useFrame` às importações.
import React, { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrthographicCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@nanostores/react';
// AJUSTE: Adicionamos `gameTick` e corrigimos o caminho para a pasta `/stores`.
import { gameState, setBuildMode, addModule, gameTick, type ModuleType } from '../../stores/store';

// Dicionário com as especificações visuais dos módulos.
const MODULE_SPECS = {
  SOLAR_PANEL: { size: [2, 1], color: '#3b82f6' },
  O2_GENERATOR: { size: [1, 1], color: '#7dd3fc' },
  BUNK: { size: [1, 2], color: '#4ade80' },
};

// Componente lógico que executa o motor do jogo a cada segundo.
function GameEngine() {
  const timeRef = useRef(0);
  useFrame((state, delta) => {
    timeRef.current += delta;
    // Se passou 1 segundo, chama o gameTick e reseta o contador.
    if (timeRef.current >= 1) {
      timeRef.current -= 1;
      gameTick();
    }
  });
  return null; // Não renderiza nada visualmente.
}

/**
 * Componente responsável por renderizar os módulos que já foram construídos.
 */
function PlacedModules() {
  const { modules } = useStore(gameState);
  return (
    <>
      {modules.map(module => (
        <mesh key={module.id} position={module.position}>
          <boxGeometry args={[MODULE_SPECS[module.type].size[0], 0.5, MODULE_SPECS[module.type].size[1]]} />
          <meshStandardMaterial color={MODULE_SPECS[module.type].color} />
        </mesh>
      ))}
    </>
  );
}

// HabitatLighting
function HabitatLighting() {
  const { subsystems } = useStore(gameState);
  const isOnline = subsystems.ILUMINACAO.status === 'online';

  return (
    <>
        <ambientLight intensity={isOnline ? 0.8 : 0.1} />
        <directionalLight position={[10, 20, 5]} intensity={isOnline ? 1 : 0.2} />
    </>
  )
}

/**
 * Componente que lida com toda a lógica de construção.
 */
function BuildSystem() {
  const { buildMode } = useStore(gameState);
  const [position, setPosition] = useState<[number, number, number]>([0, 0.25, 0]);

  const previewSize = useMemo(() => buildMode ? MODULE_SPECS[buildMode].size : [0, 0], [buildMode]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!buildMode) return;
    const x = Math.floor(e.point.x + 0.5);
    const z = Math.floor(e.point.z + 0.5);
    setPosition([x, 0.25, z]);
  };

  const handlePointerClick = () => {
    // AJUSTE: Adicionamos uma verificação para não permitir construir depois que a missão começa.
    if (gameState.get().missionStatus !== 'planning' || !buildMode) return;
    addModule(buildMode, position);
  };

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} onPointerMove={handlePointerMove} onClick={handlePointerClick}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {buildMode && (
        <mesh position={position}>
          <boxGeometry args={[previewSize[0], 0.5, previewSize[1]]} />
          <meshStandardMaterial color={MODULE_SPECS[buildMode].color} transparent opacity={0.6} />
        </mesh>
      )}
    </>
  );
}

/**
 * O componente principal da cena 3D.
 */
export default function GameCanvas() {
  return (
    <Canvas>
      <OrthographicCamera makeDefault zoom={50} position={[10, 10, 10]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 5]} intensity={1} />
      <Grid args={[10, 10]} position={[0, 0.01, 0]} cellColor="#666" sectionColor="#888" />

      {/* AJUSTE: Adicionamos o componente GameEngine à cena para que ele possa rodar. */}
      <GameEngine />
      <PlacedModules />
      <BuildSystem />
    </Canvas>
  );
}