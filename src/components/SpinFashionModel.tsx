import { useGLTF, useProgress } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const SpinFashionModel = ({
  rotate,
  setLoadingModal,
}: {
  rotate: boolean;
  setLoadingModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const groupRef = useRef(null);
  const gltf1 = useGLTF(`/Look/Look_001.glb`);
  const gltf2 = useGLTF(`/Look/Look_002.glb`);
  const gltf3 = useGLTF(`/Look/Look_003.glb`);
  const gltf4 = useGLTF(`/Look/Look_004.glb`);
  const gltf5 = useGLTF(`/Look/Look_005.glb`);
  const gltf6 = useGLTF(`/Look/Look_006.glb`);

  const { scrollY } = useScroll();
  const { progress } = useProgress();
  const center = { x: 0, y: 0, z: 0 };
  useEffect(() => {
    if (progress === 100) {
      setLoadingModal(false);
    }
  }, [progress, setLoadingModal]);
  useFrame((state, delta) => {
    if (rotate) {
      const angle = (state.clock.getElapsedTime() % 2) * Math.PI;
      const radius = 2; // 공전 반경
      [
        gltf1.scene,
        gltf2.scene,
        gltf3.scene,
        gltf4.scene,
        gltf5.scene,
        gltf6.scene,
      ].forEach((_scene) => {
        const _x = _scene.position.x + Math.cos(angle) * radius;
        const _y = _scene.position.y;
        const _z = _scene.position.z + Math.sin(angle) * radius;
        _scene.position.set(_x, _y, _z);
      });
    } else {
      const angle = ((((scrollY as any).current / 1000) % 4) / 2) * Math.PI;
      const radius = 100; // 공전 반경
      [
        gltf1.scene,
        gltf2.scene,
        gltf3.scene,
        gltf4.scene,
        gltf5.scene,
        gltf6.scene,
      ].forEach((_scene) => {
        const _x = Math.cos(angle) * radius;
        const _y = _scene.position.y;
        const _z = Math.sin(angle) * radius;
        console.log(_x, _y, _z);
        _scene.position.set(_x, _y, _z);
      });
    }
  });

  return (
    <>
      <group
        ref={groupRef}
        position={[10, -20, 25]}
        rotation={[Math.PI / 8, Math.PI / 8, -Math.PI / 4]}
        dispose={null}
      >
        <primitive object={gltf1.scene} />
      </group>
      <group position={[0, 0, 10]} dispose={null}>
        <primitive object={gltf2.scene} />
      </group>
      <group
        position={[-20, 0, -60]}
        rotation={[-Math.PI / 16, -Math.PI / 8, -Math.PI / 16]}
        dispose={null}
      >
        <primitive object={gltf3.scene} />
      </group>
      <group
        position={[35, 5, -80]}
        rotation={[Math.PI / 32, -Math.PI / 8, Math.PI / 8]}
        dispose={null}
      >
        <primitive object={gltf4.scene} />
      </group>
      <group
        position={[10, 15, -160]}
        rotation={[-Math.PI / 8, Math.PI - Math.PI / 8, Math.PI / 8]}
        dispose={null}
      >
        <primitive object={gltf5.scene} />
      </group>
      <group
        position={[30, 30, -200]}
        rotation={[Math.PI / 32, -Math.PI / 8, Math.PI / 8]}
        dispose={null}
      >
        <primitive object={gltf6.scene} />
      </group>
    </>
  );
};

export default SpinFashionModel;
