"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());

      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load("/next.svg");
      const material = new THREE.MeshStandardMaterial({ map: texture });

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setClearColor(0x000000, 0);

      const camera = new THREE.PerspectiveCamera(40, 1);
      camera.position.set(1.5, 1, 1);

      const loader = new GLTFLoader();

      const first_light = new THREE.DirectionalLight(0xffffff, 10);
      first_light.position.set(200, 100, 100);
      scene.add(first_light);

      const second_light = new THREE.DirectionalLight(0xffffff, 10);
      second_light.position.set(-100, -100, -100);
      scene.add(second_light);

      const third_light = new THREE.AmbientLight(0xffffff, 50);
      scene.add(third_light);

      let controls = new OrbitControls(camera, canvasRef.current);
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 0.8;
      controls.minDistance = 10;
      controls.maxDistance = 20;
      controls.enableDamping = true;

      const animate = () => {
        requestAnimationFrame(animate);
        scene.position.x += scene.position.x - center.x;
        scene.position.y += scene.position.y - center.y;
        scene.position.z += scene.position.z - center.z;

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      loader.load("/3d-model/key.glb", (object) => {
        scene.add(object.scene);
        object.scene.traverse((o: any) => {
          if (o.isMesh) {
            o.material.metalness = 0.7;
            o.material = material;
          }
        });
      });
      renderer.render(scene, camera);
    }
  }, [canvasRef]);

  return (
    <div className="bg-white h-[100vh] flex justify-center items-center">
      <canvas ref={canvasRef} id="canvas" width="500" height="500"></canvas>
    </div>
  );
}
