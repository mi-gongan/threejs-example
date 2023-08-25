"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  Float,
  Loader,
  OrbitControls,
  Stars,
  Text3D,
  useProgress,
} from "@react-three/drei";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import CustomText3D from "@/components/CustomText3D";

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
            className="absolute left-10 z-10 bg-[#5755d544] text-[#ffffff443] w-40 flex justify-center items-center cursor-pointer rounded-md h-12"
            onClick={() => {
              setCanControl(!canControl);
            }}
          >
            제어도구 {canControl ? "끄기" : "켜기"}
          </div>
        )}
        <motion.div className="absolute z-[-1]">
          <motion.div
            className="bg-[#9dddff] w-[250px] h-[250px] rounded-full blur-[80px] absolute z-10 top-6"
            animate={{ x: [50, 10, 50], y: [-15, 0, -15] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.div
            className="bg-[#6a36597d] w-[250px] h-[250px] rounded-full blur-[80px] absolute -top-20 z-10 left-12"
            animate={{ x: [10, 0, 10], y: [0, 0, -100] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.div
            className="bg-[#5e47a885] w-[250px] h-[250px] rounded-full blur-[80px] absolute right-12 -top-12 z-10"
            animate={{ x: [10, 50, 10], y: [-10, 5, -10] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.div
            className="bg-[#c3852983] w-[200px] h-[200px] rounded-full blur-[80px] absolute -top-60 z-10 left-[50%]"
            animate={{ x: [0, -10, 0], y: [-50, 10, -50] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.div
            className="bg-[#b8bd3083] w-[200px] h-[200px] rounded-full blur-[80px] absolute -top-96 z-10 right-[50%]"
            animate={{ x: [0, -10, 0], y: [-50, 10, -50] }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
        </motion.div>

        <Canvas camera={{ position: [0, 0, 200] }}>
          {canControl && <OrbitControls />}
          <directionalLight intensity={10} position={[200, 0, 0]} />
          <directionalLight intensity={5} position={[-300, 200, -100]} />
          <ambientLight intensity={0.5} />
          <Stars
            radius={100}
            depth={50}
            count={2000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <Float>
            <SpinFashionModel
              rotate={rotate}
              setLoadingModal={setLoadingModal}
            />
          </Float>
          <Center>
            <CustomText3D />
          </Center>
        </Canvas>
      </div>
    </div>
  );
}
