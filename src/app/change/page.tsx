"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import TWEEN from "@tweenjs/tween.js";

export default function ChangeSmooth() {
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
      renderer.setClearColor(0x000000, 0);
      // 라이트
      const first_light = new THREE.DirectionalLight(0xffffff, 10);
      first_light.position.set(200, 100, 100);
      scene.add(first_light);

      const second_light = new THREE.DirectionalLight(0xffffff, 10);
      second_light.position.set(-100, -100, -100);
      scene.add(second_light);

      const third_light = new THREE.AmbientLight(0xffffff, 2);
      scene.add(third_light);

      const camera = new THREE.PerspectiveCamera(50, 1);
      camera.position.set(1.5, 1, 1);

      let currentModelIndex = 0;
      let models: THREE.Group[] = [];
      let transitionInProgress = false;

      // GLTFLoader 생성
      const loader = new GLTFLoader();

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
      loadModel("/3d-model/F_BBB_CUSTOM_D001.glb", (model) => {
        models.push(model);
        scene.add(model);
      });

      loadModel("/3d-model/F_BBB_CUSTOM_T005.glb", (model) => {
        models.push(model);
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
        models[currentModelIndex].rotation.y = window.scrollY * 0.001;
        if (window.scrollY < 2000) {
          if (currentModelIndex !== 1) {
            changeModel();
          }
        } else {
          if (currentModelIndex !== 0) {
            changeModel();
          }
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
    <div className="bg-black h-[50000px] flex justify-center items-center">
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50">
        <canvas ref={canvasRef} id="canvas" width="1000" height="1000"></canvas>
      </div>
    </div>
  );
}
