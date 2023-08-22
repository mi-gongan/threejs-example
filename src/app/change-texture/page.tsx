"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "@tweenjs/tween.js";
import { gsap } from "gsap";

export default function ChangeSmooth() {
  const [loadedPercent, setLoadedPercent] = React.useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 모델의 모든 자식 객체들의 material의 투명도 설정 함수
  function setMaterialOpacity(model: any, opacity: any) {
    model.traverse((child: any) => {
      if (child.isMesh) {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });
  }

  useEffect(() => {
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.setClearColor(0x000000, 0);
      // uv 맵
      const textureLoader = new THREE.TextureLoader();
      const texture1 = textureLoader.load("/material/hoodie_1.png");
      const texture2 = textureLoader.load("/material/hoodie_2.png");
      const material1 = new THREE.MeshStandardMaterial({ map: texture1 });
      const material2 = new THREE.MeshStandardMaterial({ map: texture2 });
      // 라이트
      const first_light = new THREE.DirectionalLight(0xffffff, 10);
      first_light.position.set(200, 100, 100);
      scene.add(first_light);

      const second_light = new THREE.DirectionalLight(0xffffff, 10);
      second_light.position.set(-100, -100, -100);
      scene.add(second_light);

      const third_light = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(third_light);

      const camera = new THREE.PerspectiveCamera(50, 1);
      camera.position.set(1.5, 1, 1);

      let currentModelIndex = 0;
      let models: THREE.Group[] = new Array(2);
      let transitionInProgress = false;

      const loadingManager = new THREE.LoadingManager();

      loadingManager.onProgress = (itemUrl, itemsLoaded, itemsTotal) => {
        setLoadedPercent((itemsLoaded / itemsTotal) * 100);
      };

      // GLTFLoader 생성
      const loader = new GLTFLoader(loadingManager);

      // 모델 로드 함수
      const loadModel = (
        modelPath: string,
        callback: (model: THREE.Group) => void
      ) => {
        loader.load(modelPath, (gltf) => {
          let model = gltf.scene;

          // 계산된 바운딩 박스
          const boundingBox = new THREE.Box3().setFromObject(model);

          // 모델의 중심 좌표 계산
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);

          camera.position.set(center.x, center.y, center.z - 100);
          camera.lookAt(center);

          //   모델 위치 설정
          model.position.set(center.x, center.y, center.z);

          callback(model);
        });
      };

      // 모델들을 로드
      loadModel("/3d-model/dress.glb", (model) => {
        models[0] = model;
        scene.add(model);
      });

      let currentMaterial: THREE.MeshStandardMaterial;

      loadModel("/3d-model/hoodie.glb", (model) => {
        model.traverse((o: any) => {
          if (o.isMesh) {
            o.material.metalness = 0.7;
            o.material = material1;
          }
        });
        currentMaterial = material1;
        models[1] = model;
        model.visible = false; // 초기에 보이지 않게 설정
        scene.add(model);
      });

      const changeModel = () => {
        if (!transitionInProgress) {
          transitionInProgress = true;

          // 현재 모델과 다음 모델 준비
          const currentModel = models[currentModelIndex];
          const nextModelIndex = (currentModelIndex + 1) % models.length;
          const nextModel = models[nextModelIndex];

          // 다음 모델을 보여주고 투명도 페이드 인
          nextModel.visible = true;
          setMaterialOpacity(nextModel, 0); // 투명도 0으로 설정

          new TWEEN.Tween({ opacity: 0 })
            .to({ opacity: 1 }, 50)
            .onUpdate(({ opacity }) => {
              setMaterialOpacity(nextModel, opacity); // 투명도 업데이트
            })
            .onComplete(() => {
              // 현재 모델과 다음 모델 상태 업데이트
              currentModelIndex = nextModelIndex;
              currentModel.visible = false;

              transitionInProgress = false;
            })
            .start();
        }
      };

      // 스크롤 이벤트 리스너 등록
      window.addEventListener("scroll", () => {
        if (window.scrollY < 2000) {
          models[currentModelIndex].rotation.y = window.scrollY * 0.005;
          if (currentModelIndex !== 0) {
            changeModel();
          }
        } else {
          if (currentModelIndex !== 1) {
            changeModel();
          }
        }
        if (
          currentModelIndex !== 0 &&
          scrollY > 4000 &&
          currentMaterial !== material2
        ) {
          models[currentModelIndex].traverse((o: any) => {
            if (o.isMesh) {
              o.material.metalness = 0.7;
              o.material = material2;
            }
          });
          currentMaterial = material2;
          gsap.to(models[currentModelIndex].rotation, {
            y: -Math.PI * 4,
            duration: 5,
            ease: "power4.out",
          });
        } else if (
          currentModelIndex !== 0 &&
          scrollY < 4000 &&
          currentMaterial !== material1
        ) {
          models[currentModelIndex].traverse((o: any) => {
            if (o.isMesh) {
              o.material.metalness = 0.7;
              o.material = material1;
            }
          });
          currentMaterial = material1;
          gsap.to(models[currentModelIndex].rotation, {
            y: Math.PI * 4,
            duration: 5,
            ease: "power4.out",
          });
        }
      });

      // 애니메이션 루프
      const animate = () => {
        requestAnimationFrame(animate);
        TWEEN.update();
        renderer.render(scene, camera);
      };
      animate();

      renderer.render(scene, camera);
    }
  }, [canvasRef]);

  return (
    <div className="bg-black h-[50000px] flex justify-center items-center relative">
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50">
        <div className="relative z-10 bg-white text-red-500">
          {loadedPercent}%...
        </div>
        <canvas ref={canvasRef} id="canvas" width="1000" height="1000"></canvas>
      </div>
    </div>
  );
}
