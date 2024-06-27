

const Paddle = ({position}) =>{
    return (
        <mesh position={position}>
          <boxGeometry args={[2, 2, 0.1]} />
          <meshPhongMaterial color="blue" />
        </mesh>
      );
};

export default Paddle;