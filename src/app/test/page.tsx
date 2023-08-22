"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useSpring, a } from "@react-spring/three";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { gsap } from "gsap";

export default function ChangeSmooth() {
  const [canControl, setCanControl] = useState(false);
  return (
    <div className="bg-black h-[50000px] flex justify-center items-center relative">
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50">
        <div
          className="relative left-10 z-10 bg-[#5755d544] text-[#ffffff443] w-40 flex justify-center items-center cursor-pointer rounded-md h-12"
          onClick={() => {
            if (canControl) {
              window.location.reload();
            } else {
              setCanControl(true);
            }
          }}
        >
          제어도구 {canControl ? "끄기" : "켜기"}
        </div>
        <Canvas
          //   frameloop="demand"
          performance={{ min: 1 }}
          camera={{ position: [0, 50, 80] }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
          resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}
        >
          {canControl && <OrbitControls />}
          <directionalLight intensity={10} position={[200, 0, 0]} />
          <directionalLight intensity={5} position={[-300, 200, -100]} />
          {/* <directionalLight intensity={2} position={[0, 100, 100]} /> */}
          <ambientLight intensity={0.5} />
          <FashionModel />
        </Canvas>
      </div>
    </div>
  );
}

const FashionModel = () => {
  const groupRef = useRef(null);
  const gltf1 = useGLTF(`/LOOK_001.glb`);
  const gltf2 = useGLTF(`/LOOK_002.glb`);
  const gltf3 = useGLTF(`/LOOK_003.glb`);
  const gltf4 = useGLTF(`/3d-model/LOOK_004.glb`);
  const gltf5 = useGLTF(`/3d-model/LOOK_005.glb`);
  const gltf6 = useGLTF(`/3d-model/LOOK_006.glb`);
  const { scrollY } = useScroll();
  useFrame((state, delta) => {
    // 모든 모델 조금씩 사방으로 이동하기
    // 모델 1
    gltf1.scene.rotation.y += delta / 2;
    // 모델 2
    gltf2.scene.rotation.y += delta / 2;
    // 모델 3
    gltf3.scene.rotation.z += delta / 3;
    // 모델 4
    gltf4.scene.rotation.y += delta / 4;
    gltf4.scene.rotation.x += delta / 2;
    // 모델 5
    gltf5.scene.rotation.y += delta;
    // 모델 6
    gltf6.scene.rotation.x += delta;
  });
  return (
    <>
      <group
        ref={groupRef}
        position={[10, -20, 25]}
        rotation={[Math.PI / 8, Math.PI / 8, -Math.PI / 4]}
      >
        <primitive object={gltf1.scene} />
      </group>
      <group position={[0, 0, 10]}>
        <primitive object={gltf2.scene} />
      </group>
      <group
        position={[-20, 0, -60]}
        rotation={[-Math.PI / 16, -Math.PI / 8, -Math.PI / 16]}
      >
        <primitive object={gltf3.scene} />
      </group>
      <group
        position={[35, 5, -80]}
        rotation={[Math.PI / 32, -Math.PI / 8, Math.PI / 8]}
      >
        <primitive object={gltf4.scene} />
      </group>
      <group
        position={[10, 15, -160]}
        rotation={[-Math.PI / 8, Math.PI - Math.PI / 8, Math.PI / 8]}
      >
        <primitive object={gltf5.scene} />
      </group>
      <group
        position={[30, 30, -200]}
        rotation={[Math.PI / 32, -Math.PI / 8, Math.PI / 8]}
      >
        <primitive object={gltf6.scene} />
      </group>
    </>
  );
};
