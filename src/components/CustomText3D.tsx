import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import React, { useRef } from "react";

function CustomText3D() {
  const { scrollY } = useScroll();
  const textRef = useRef(null);

  useFrame((state, delta) => {
    const distance = (scrollY as any).current * 10;
    (textRef.current as any).position.x = distance;
  });

  return (
    <Text3D
      ref={textRef}
      font={"/font/pretendard.json"}
      position={[200, 0, 0]}
      size={30}
      height={2}
      bevelEnabled={true}
      bevelThickness={1}
      bevelSize={0.5}
      bevelOffset={0.5}
      bevelSegments={3}
    >
      sasdfasdfasd
      <meshNormalMaterial />
    </Text3D>
  );
}

export default CustomText3D;
