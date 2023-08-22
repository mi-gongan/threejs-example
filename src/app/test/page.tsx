"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";

const FashionModel = dynamic(() => import("../../components/FashionModel"), {
  ssr: false,
});

export default function ChangeSmooth() {
  const [canControl, setCanControl] = useState(false);
  const [rotate, setRotate] = useState(false);
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
        <div
          className="relative left-20 z-10 bg-[#5755d544] text-[#ffffff443] w-40 flex justify-center items-center cursor-pointer rounded-md h-12"
          onClick={() => {
            setRotate(!rotate);
          }}
        >
          회전 {rotate ? "끄기" : "켜기"}
        </div>
        <Canvas
          //   frameloop="demand"
          camera={{ position: [0, 50, 80] }}
          //   onCreated={({ gl }) => {
          //     gl.setClearColor(0x000000, 0);
          //   }}
        >
          {canControl && <OrbitControls />}
          <directionalLight intensity={10} position={[200, 0, 0]} />
          <directionalLight intensity={5} position={[-300, 200, -100]} />
          {/* <directionalLight intensity={2} position={[0, 100, 100]} /> */}
          <ambientLight intensity={0.5} />
          <FashionModel rotate={rotate} />
        </Canvas>
      </div>
    </div>
  );
}
