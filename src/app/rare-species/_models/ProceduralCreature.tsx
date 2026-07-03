"use client";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   PROCEDURAL 3D CRYSTAL SPECIMEN GENERATOR
   Converts 2D photorealistic animal images/emojis into volumetric
   3D relief sculptures sealed inside a transparent, refractive
   crystal block. Reacts beautifully to light, shadows, and rotation.
   ═══════════════════════════════════════════════════════════════ */

interface BodyParams {
  primaryColor: string;
  secondaryColor: string;
  bodyScale: [number, number, number];
  limbCount: number;
  hasHorns: boolean;
  hasWings: boolean;
  hasTail: boolean;
  hasFins: boolean;
  hasShell: boolean;
  specialFeature: string;
}

interface Props {
  bodyType: string;
  bodyParams: BodyParams;
  detail?: boolean;
  speciesId?: string;
  emoji?: string;
}

/* ── Glow particles ──────────────────────────────────────────── */
function SpecimenParticles({ color, radius, count = 100 }: { color: string; radius: number; count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      // Particle box cloud shape
      pts[i * 3] = (Math.random() - 0.5) * radius * 1.5;
      pts[i * 3 + 1] = (Math.random() - 0.5) * radius * 1.5;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, [radius, count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.05;
      ref.current.rotation.x = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={color}
        size={0.035}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function ProceduralCreature({ bodyType, bodyParams, detail = false, speciesId, emoji }: Props) {
  const group = useRef<THREE.Group>(null!);
  const [textures, setTextures] = useState<{ map: THREE.Texture | null; displacementMap: THREE.Texture | null }>({
    map: null,
    displacementMap: null,
  });

  const hasImage = !!speciesId;

  // Generate Color and Displacement map on the fly
  useEffect(() => {
    let active = true;
    const size = 512;

    if (hasImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `/species-images/${speciesId}.png`;
      img.onload = () => {
        if (!active) return;

        const w = img.width;
        const h = img.height;

        // Temporary canvas to analyze pixels and build displacement map
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = w;
        tempCanvas.height = h;
        const tCtx = tempCanvas.getContext("2d")!;
        tCtx.drawImage(img, 0, 0);

        const imgData = tCtx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Check if there is transparency in the image (alpha < 240)
        let hasAlpha = false;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] < 240) {
            hasAlpha = true;
            break;
          }
        }

        // Color texture canvas
        const colorCanvas = document.createElement("canvas");
        colorCanvas.width = w;
        colorCanvas.height = h;
        const cCtx = colorCanvas.getContext("2d")!;

        // Displacement heightmap canvas
        const dispCanvas = document.createElement("canvas");
        dispCanvas.width = w;
        dispCanvas.height = h;
        const dCtx = dispCanvas.getContext("2d")!;

        // Fill background with black (neutral depth)
        dCtx.fillStyle = "#000000";
        dCtx.fillRect(0, 0, w, h);

        if (hasAlpha) {
          // Transparent image (original style): draw directly
          cCtx.drawImage(img, 0, 0);

          // Convert non-transparent pixels to solid white based on alpha channel
          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            data[i] = alpha;
            data[i + 1] = alpha;
            data[i + 2] = alpha;
          }
          tCtx.putImageData(imgData, 0, 0);

          // Blur the silhouette to create smooth rounded slopes at edges
          dCtx.filter = "blur(12px)";
          dCtx.drawImage(tempCanvas, 0, 0);
        } else {
          // Opaque photo (Wikipedia style): rounded corner mask and volumetric cushion
          cCtx.beginPath();
          cCtx.roundRect(w * 0.05, h * 0.05, w * 0.9, h * 0.9, Math.min(w, h) * 0.08);
          cCtx.clip();
          cCtx.drawImage(img, 0, 0);

          // Heightmap: Draw a white rounded rectangle slightly inset
          tCtx.fillStyle = "#000000";
          tCtx.fillRect(0, 0, w, h);
          tCtx.fillStyle = "#ffffff";
          tCtx.beginPath();
          tCtx.roundRect(w * 0.08, h * 0.08, w * 0.84, h * 0.84, Math.min(w, h) * 0.08);
          tCtx.fill();

          // Blur heavily to create a smooth pillowy dome cushion shape
          dCtx.filter = "blur(20px)";
          dCtx.drawImage(tempCanvas, 0, 0);
        }

        const colorTex = new THREE.CanvasTexture(colorCanvas);
        colorTex.colorSpace = THREE.SRGBColorSpace;

        const dispTex = new THREE.CanvasTexture(dispCanvas);

        setTextures({ map: colorTex, displacementMap: dispTex });
      };
      img.onerror = () => {
        createEmojiFallback();
      };
    } else {
      createEmojiFallback();
    }

    function createEmojiFallback() {
      if (!active) return;

      // Color texture canvas (emoji)
      const colorCanvas = document.createElement("canvas");
      colorCanvas.width = size;
      colorCanvas.height = size;
      const ctx = colorCanvas.getContext("2d")!;

      // Draw glowing background gradient
      const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
      const c = new THREE.Color(bodyParams.primaryColor);
      grad.addColorStop(0, `rgba(${Math.floor(c.r * 255)}, ${Math.floor(c.g * 255)}, ${Math.floor(c.b * 255)}, 0.35)`);
      grad.addColorStop(0.6, `rgba(${Math.floor(c.r * 255)}, ${Math.floor(c.g * 255)}, ${Math.floor(c.b * 255)}, 0.08)`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Draw large emoji
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "240px serif";
      ctx.fillText(emoji || "🌿", 256, 256);

      // Displacement canvas
      const dispCanvas = document.createElement("canvas");
      dispCanvas.width = size;
      dispCanvas.height = size;
      const dCtx = dispCanvas.getContext("2d")!;
      dCtx.fillStyle = "#000000";
      dCtx.fillRect(0, 0, size, size);

      // Create solid white silhouette of emoji
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tCtx = tempCanvas.getContext("2d")!;
      tCtx.textAlign = "center";
      tCtx.textBaseline = "middle";
      tCtx.font = "240px serif";
      tCtx.fillStyle = "#ffffff";
      tCtx.fillText(emoji || "🌿", 256, 256);

      // Blur to create depth
      dCtx.filter = "blur(18px)";
      dCtx.drawImage(tempCanvas, 0, 0);

      const colorTex = new THREE.CanvasTexture(colorCanvas);
      colorTex.colorSpace = THREE.SRGBColorSpace;

      const dispTex = new THREE.CanvasTexture(dispCanvas);

      setTextures({ map: colorTex, displacementMap: dispTex });
    }

    return () => {
      active = false;
    };
  }, [speciesId, emoji, bodyParams.primaryColor]);

  // Idle floating and rotating animation
  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.getElapsedTime();
      // Smooth hovering
      group.current.position.y = Math.sin(t * 0.65) * 0.08;
      // Gentle tilt rotation to capture specular highlights on the glass edges
      group.current.rotation.y = Math.sin(t * 0.3) * 0.15;
      group.current.rotation.x = Math.cos(t * 0.25) * 0.06;
    }
  });

  if (!textures.map) return null;

  const size = detail ? 2.8 : 1.9;
  const boxWidth = size + 0.3;
  const boxHeight = size + 0.3;
  const boxDepth = 0.42;

  return (
    <group ref={group}>
      {/* ── 3D CRYSTAL SPECIMEN BLOCK ───────────────────────────── */}
      <mesh renderOrder={1} castShadow receiveShadow>
        <boxGeometry args={[boxWidth, boxHeight, boxDepth]} />
        <meshPhysicalMaterial
          color={bodyParams.primaryColor}
          transmission={0.88}      // Glass transparency
          roughness={0.06}         // Polished shine
          metalness={0.02}
          thickness={0.35}         // Specimen thickness distortion
          ior={1.48}               // Refractive index of crystal
          clearcoat={1.0}          // Highly reflective outer layer
          clearcoatRoughness={0.03}
          transparent
          opacity={0.32}
          depthWrite={true}
        />
      </mesh>

      {/* Futuristic glowing wireframe bracket around crystal */}
      <mesh>
        <boxGeometry args={[boxWidth * 1.008, boxHeight * 1.008, boxDepth * 1.008]} />
        <meshBasicMaterial
          color={bodyParams.primaryColor}
          wireframe
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ── VOLUMETRIC CREATURE SCULPTURE (Double-Sided Relief) ─── */}
      <group renderOrder={0}>
        {/* Front Face: displaced forward */}
        <mesh position={[0, 0, 0.015]} castShadow>
          <planeGeometry args={[size, size, 128, 128]} />
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.displacementMap}
            displacementScale={0.32}
            displacementBias={0.0}
            roughness={0.3}
            metalness={0.1}
            transparent
            alphaTest={0.04}
          />
        </mesh>

        {/* Back Face: displaced backward (flipped Z) */}
        <mesh position={[0, 0, -0.015]} rotation={[0, Math.PI, 0]} castShadow>
          <planeGeometry args={[size, size, 128, 128]} />
          <meshStandardMaterial
            map={textures.map}
            displacementMap={textures.displacementMap}
            displacementScale={0.32}
            displacementBias={0.0}
            roughness={0.3}
            metalness={0.1}
            transparent
            alphaTest={0.04}
          />
        </mesh>
      </group>

      {/* Specimen particles inside containment block */}
      <SpecimenParticles color={bodyParams.primaryColor} radius={size} />
    </group>
  );
}
