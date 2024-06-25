'use client'
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const Plane = () => {
  return (
    <mesh >
    <boxGeometry args={[10, 5, 20]} /> // Width, Height, Depth
      <meshPhongMaterial 
        color="red" 
        side={THREE.DoubleSide} 
        transparent={true} 
        opacity={0.2} 
      />

    </mesh>
  );
};

const SuperBall = () => {
  const ballRef = useRef();
  const velocity = useRef(new THREE.Vector3(5, 3, 10));
  const bounceFactor = 1; // Perfect elasticity
  const radius = 0.5; // Ball radius
  const maxX = 5 - radius;
  const maxY = 2.5 - radius;
  const maxZ = 10 - radius;

  useFrame((state, delta) => {
    if (ballRef.current) {
      let newX = ballRef.current.position.x + velocity.current.x * delta;
      let newY = ballRef.current.position.y + velocity.current.y * delta;
      let newZ = ballRef.current.position.z + velocity.current.z * delta;

      // Check and handle X-axis collisions
      if (Math.abs(newX) > maxX) {
        newX = Math.sign(newX) * maxX;
        velocity.current.x = -velocity.current.x * bounceFactor;
      }

      // Check and handle Y-axis collisions
      if (Math.abs(newY) > maxY) {
        newY = Math.sign(newY) * maxY;
        velocity.current.y = -velocity.current.y * bounceFactor;
      }

      // Check and handle Z-axis collisions
      if (Math.abs(newZ) > maxZ) {
        newZ = Math.sign(newZ) * maxZ;
        velocity.current.z = -velocity.current.z * bounceFactor;
      }

      // Update position
      ballRef.current.position.set(newX, newY, newZ);
    }
  });

  return (
    <Sphere ref={ballRef} args={[radius, 32, 32]} position={[0, 0, 0]}>
      <meshPhysicalMaterial 
        color="#88ccff" 
        metalness={0.9}
        roughness={0.1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Sphere>
  );
}
const ThreeScene = () => {
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      minWidth: '1000px', 
      minHeight: '1000px'
    }}>
      <Canvas camera={{ position: [-10, 10, 15], fov: 60 }}>
        <OrbitControls />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.6} />
        <Plane />
        <SuperBall />
      </Canvas>
    </div>
  );
};

export default ThreeScene;