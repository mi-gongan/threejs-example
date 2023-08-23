import { useGLTF, useProgress } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { useScroll } from "framer-motion";
import React, { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const FashionModel = ({ rotate }: { rotate: boolean }) => {
  const groupRef = useRef(null);
  const gltf1 = useGLTF(`/Look/Look_001.glb`);
  const gltf2 = useGLTF(`/Look/Look_002.glb`);
  const gltf3 = useGLTF(`/Look/Look_003.glb`);
  const gltf4 = useGLTF(`/Look/Look_004.glb`);
  const gltf5 = useGLTF(`/Look/Look_005.glb`);
  const gltf6 = useGLTF(`/Look/Look_006.glb`);
  const { scrollY } = useScroll();
  useFrame((state, delta) => {
    if (rotate) {
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
    } else {
      gltf1.scene.rotation.y = (scrollY as any).current * 0.005;
      gltf2.scene.rotation.y = (scrollY as any).current * 0.005;
      gltf3.scene.rotation.z = (scrollY as any).current * 0.005;
      gltf4.scene.rotation.y = (scrollY as any).current * 0.005;
      gltf4.scene.rotation.x = (scrollY as any).current * 0.005;
      gltf5.scene.rotation.y = (scrollY as any).current * 0.005;
      gltf6.scene.rotation.x = (scrollY as any).current * 0.005;
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

export default FashionModel;
