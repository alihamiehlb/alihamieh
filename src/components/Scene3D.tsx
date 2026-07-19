"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

type Scene3DProps = {
  mouseX: number;
  mouseY: number;
};

function AquaOrb({
  position,
  scale,
  speed,
  mouseX,
  mouseY,
  color,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  mouseX: number;
  mouseY: number;
  color: string;
}) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.position.x =
      position[0] + Math.sin(t) * 0.4 + mouseX * 0.8;
    ref.current.position.y =
      position[1] + Math.cos(t * 0.8) * 0.35 + mouseY * 0.6;
    ref.current.rotation.x = mouseY * 0.5 + t * 0.15;
    ref.current.rotation.y = mouseX * 0.5 + t * 0.2;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <Sphere ref={ref} args={[scale, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.28}
          speed={2}
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.55}
        />
      </Sphere>
    </Float>
  );
}

function SceneInner({ mouseX, mouseY }: Scene3DProps) {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 8]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, 2, 4]} intensity={0.6} color="#a8e8f0" />
      <AquaOrb
        position={[-2.2, 0.5, -2]}
        scale={0.9}
        speed={0.7}
        mouseX={mouseX}
        mouseY={mouseY}
        color="#5ec8d8"
      />
      <AquaOrb
        position={[2.4, -0.3, -1.5]}
        scale={0.55}
        speed={1.1}
        mouseX={mouseX * 0.7}
        mouseY={mouseY * 0.7}
        color="#a8e8f0"
      />
      <AquaOrb
        position={[0.2, 1.2, -3]}
        scale={0.35}
        speed={1.4}
        mouseX={mouseX * 1.2}
        mouseY={mouseY * 1.2}
        color="#ffffff"
      />
    </>
  );
}

export default function Scene3D({ mouseX, mouseY }: Scene3DProps) {
  return (
    <div className="scene3d" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.2]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <SceneInner mouseX={mouseX} mouseY={mouseY} />
      </Canvas>
    </div>
  );
}
