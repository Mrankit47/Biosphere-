"use client";

import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useExperience } from "./ExperienceContext";
import gsap from "gsap";
import * as THREE from "three";

export const ExperienceCameraManager: React.FC = () => {
  const { camera, controls } = useThree();
  const { cameraCommand, clearCameraCommand } = useExperience();
  const activeAnimationRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!cameraCommand) return;
    if (!controls) {
      // If controls aren't registered yet, we can transition camera position directly
      gsap.to(camera.position, {
        x: cameraCommand.position[0],
        y: cameraCommand.position[1],
        z: cameraCommand.position[2],
        duration: cameraCommand.duration,
        ease: "power3.out",
        onUpdate: () => {
          camera.lookAt(new THREE.Vector3(...cameraCommand.target));
        },
        onComplete: clearCameraCommand
      });
      return;
    }

    // Cancel active tweens to prevent stutter
    activeAnimationRef.current.forEach((t) => t.kill());
    activeAnimationRef.current = [];

    const ctrl = controls as any;

    // Enable local updates during animation
    const targetTween = gsap.to(ctrl.target, {
      x: cameraCommand.target[0],
      y: cameraCommand.target[1],
      z: cameraCommand.target[2],
      duration: cameraCommand.duration,
      ease: "power3.out",
      onUpdate: () => {
        ctrl.update();
      }
    });

    const posTween = gsap.to(camera.position, {
      x: cameraCommand.position[0],
      y: cameraCommand.position[1],
      z: cameraCommand.position[2],
      duration: cameraCommand.duration,
      ease: "power3.out",
      onUpdate: () => {
        camera.lookAt(ctrl.target.x, ctrl.target.y, ctrl.target.z);
        ctrl.update();
      },
      onComplete: () => {
        clearCameraCommand();
      }
    });

    activeAnimationRef.current = [targetTween, posTween];

    return () => {
      targetTween.kill();
      posTween.kill();
    };
  }, [cameraCommand, camera, controls, clearCameraCommand]);

  return null;
};
