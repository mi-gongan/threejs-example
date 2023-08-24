"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, Loader, OrbitControls, useProgress } from "@react-three/drei";
import dynamic from "next/dynamic";

const SpinFashionModel = dynamic(
  () => import("../../components/SpinFashionModel"),
  {
    ssr: false,
  }
);

export default function ChangeSmooth() {
  const [canControl, setCanControl] = useState(false);
  const [rotate, setRotate] = useState(false);
  const { progress } = useProgress();
  const [loadingModal, setLoadingModal] = useState(true);
  return (
    <div className="bg-black h-[50000px] flex justify-center items-center relative">
      {loadingModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 z-2 bg-black">
          <div className="text-[#ffffff443] w-40 flex justify-center items-center rounded-md h-12 text-lg">
            {progress}%
          </div>
        </div>
      )}
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50">
        {!loadingModal && (
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
        )}
        <Canvas camera={{ position: [0, 50, 150] }}>
          {canControl && <OrbitControls />}
          <directionalLight intensity={10} position={[200, 0, 0]} />
          <directionalLight intensity={5} position={[-300, 200, -100]} />
          <ambientLight intensity={0.5} />
          <Float>
            <SpinFashionModel
              rotate={rotate}
              setLoadingModal={setLoadingModal}
            />
          </Float>
        </Canvas>
      </div>
    </div>
  );
}
