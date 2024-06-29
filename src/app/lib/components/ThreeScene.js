'use client'
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

//plane
const Plane = () => {
  return (
    <group>

    <ambientLight />
      <mesh>
        <boxGeometry args={[10, 0.5, 20]} />
        <meshPhongMaterial 
          color="red" 
          side={THREE.DoubleSide} 
          transparent={true} 
          opacity={0.2} 
        />
      </mesh>
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(10, 0.5, 20)]} />
        <lineBasicMaterial attach="material" color="red" />
      </lineSegments>
    </group>
  );
};

// paddel
const Paddle = ({position}) =>{
  return (
      <mesh position={position}>
        <boxGeometry args={[2, 0.2, 0.1]} />
        <meshPhongMaterial color="white" />
      </mesh>
    );
};

// velocity is the distance done in the delta time v = ∆ Distance / ∆time;
// ball + victory logic + paddle collision
const SuperBall = ({ paddlePositions, onScoreUpdate }) => {
  const ballRef = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const radius = 0.2; // Ball radius
  const maxX = 5 - radius; // cho3a3 howa radius
  const maxZ = 10 - radius;
  const winScore = 3;
  const [countdown, setCountdown] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const lastCollisionTime = useRef(0); //
  const COLLISION_COOLDOWN = 0.1; // seconds
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState(null);
  const [online, setOnline] = useState({player1:false, player2: false});
  const getRandomStartAngle = () => {
    const randomQuadrant = Math.random() < 0.5 ? 0 : Math.PI;
    return randomQuadrant + Math.PI / 4 + Math.random() * Math.PI / 2;
  };

  const resetBall = () => {
    const angle = getRandomStartAngle();
    const speed = 10;
    velocity.current.set( speed,
      0,
      Math.sin(angle) * speed
    );
    if (ballRef.current) {
      ballRef.current.position.set(0, 0, 0);
    }
  };
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      resetBall();
    }
  }, [countdown, gameStarted]);

  useFrame((state, delta) => {
    if (ballRef.current && gameStarted && !winner) {
      const PADDLE_DEPTH = 0.1; //lghold
      const PADDLE_HALF_WIDTH = 1;
      const ANGLE_SENSITIVITY = 3;
      const MIN_VELOCITY = 8;
      const MAX_VELOCITY = 15;

      let newX = ballRef.current.position.x + velocity.current.x * delta;
      let newZ = ballRef.current.position.z + velocity.current.z * delta;

      // Wall collisions
      if (Math.abs(newX) > maxX) {
        newX = Math.sign(newX) * maxX;
        velocity.current.x = -velocity.current.x;
      }

      const currentTime = state.clock.getElapsedTime();

      // Paddle collisions
      paddlePositions.forEach(paddlePos => {
        const movingTowardsPaddle = Math.sign(velocity.current.z) === Math.sign(paddlePos.z);
        if (movingTowardsPaddle &&
            Math.abs(newZ - paddlePos.z) < (PADDLE_DEPTH + radius) &&
            Math.abs(newX - paddlePos.x) < PADDLE_HALF_WIDTH &&
            currentTime - lastCollisionTime.current > COLLISION_COOLDOWN) {
          
          newZ = paddlePos.z - Math.sign(paddlePos.z) * (PADDLE_DEPTH + radius);
          velocity.current.z = -velocity.current.z;
          
          const paddleCenter = paddlePos.x;
          const ballOffset = newX - paddleCenter;
          const angleFactor = ballOffset / ANGLE_SENSITIVITY;
          velocity.current.x = angleFactor * Math.abs(velocity.current.z);
          
          const speed = new THREE.Vector3().copy(velocity.current).length();
          if (speed < MIN_VELOCITY) {
            velocity.current.normalize().multiplyScalar(MIN_VELOCITY);
          }
          if (speed > MAX_VELOCITY) {
            velocity.current.normalize().multiplyScalar(MAX_VELOCITY);
          }

          lastCollisionTime.current = currentTime;
        }
      });
      // End zone collisions
      if (Math.abs(newZ) > maxZ) {
        let newScore;
        if (newZ > maxZ) {
          newScore = { ...score, player1: score.player1 + 1 };
        } else {
          newScore = { ...score, player2: score.player2 + 1 };
        }
        setScore(newScore);
        
        // Check for winner
        if (newScore.player1 >= winScore) {
          setWinner('Player 1');
          newX = 0;
          newZ = 0;
        } else if (newScore.player2 >= winScore) {
          setWinner('Player 2');
          newX = 0;
          newZ = 0;
        } else {
          resetBall();
          newX = 0;
          newZ = 0;
        }
      }

      // Update position
      ballRef.current.position.set(newX, 0, newZ);
    }
  });

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  return (
    <>
      <Sphere ref={ballRef} args={[radius, 32, 32]} position={[0, 0, 0]}>
        <meshPhysicalMaterial 
          color="#88ccff" 
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
      {countdown > 0 && (
        <Html center>
          <div style={{
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            {countdown}
          </div>
        </Html>
      )}
      <Html position={[-5, 3, 0]}>
        <div style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Player 1: {score.player1}
        </div>
      </Html>
      <Html position={[5, 3, 0]}>
        <div style={{
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Player 2: {score.player2}
        </div>
      </Html>
      {winner && (
        <Html center>
          <div style={{
            position: 'relative',
            alignContent:'center',
            width: '500px',
            height: '500px',
            color: 'white',
            fontSize: '52px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.9)',
            padding: '40px',
            borderRadius: '10px'
          }}>
            {winner} wins! <br/>
            score :
            {score.player1} : {score.player2}

          </div>
        </Html>
      )}
    </>
  );
}

const ThreeScene = () => {
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [paddle1Pos, setPaddle1Pos] = useState([0, 0, 9.9]);
  const [paddle2Pos, setPaddle2Pos] = useState([0, 0, -9.9]);
  useEffect(() => {
    let paddle1Direction = 0;
    let paddle2Direction = 0;
  
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          paddle1Direction = -1;
          break;
        case 'ArrowRight':
          paddle1Direction = 1;
          break;
        case 'a':
          paddle2Direction = -1;
          break;
        case 'd':
          paddle2Direction = 1;
          break;
      }
    };
  
    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          paddle1Direction = 0;
          break;
        case 'a':
        case 'd':
          paddle2Direction = 0;
          break;
      }
    };
  
    const animate = () => {
      setPaddle1Pos(prev => [
        Math.max(Math.min(prev[0] + paddle1Direction * 0.5, 4), -4),
        prev[1],
        prev[2]
      ]);
      setPaddle2Pos(prev => [
        Math.max(Math.min(prev[0] + paddle2Direction * 0.5, 4), -4),
        prev[1],
        prev[2]
      ]);
      requestAnimationFrame(animate);
    };
  
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animate();
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  //score and win
  const hanbleScoreUpdate = (newScore) => {
    setScore(newScore);
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      minWidth: '1000px', 
      minHeight: '1000px'
    }}>
      <Canvas camera={{ position: [-10, 10, 15], fov: 60 }}>
        <OrbitControls />
        {/* <ambientLight intensity={0.4} /> */}
        <Plane />
        <SuperBall paddlePositions={[
          {x: paddle1Pos[0], y: paddle1Pos[1], z: paddle1Pos[2]},
          {x: paddle2Pos[0], y: paddle2Pos[1], z: paddle2Pos[2]}
        ]} onScoreUpdate={hanbleScoreUpdate} />
        <Paddle position={paddle1Pos} />
        <Paddle position={paddle2Pos} />
      </Canvas>
    </div>
  );
};
export default ThreeScene;