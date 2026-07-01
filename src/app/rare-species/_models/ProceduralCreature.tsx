"use client";
import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════════════════════════════
   PROCEDURAL CREATURE — Displays realistic AI-generated animal
   images on textured 3D planes with particle aura effects.
   Falls back to a stylized emoji glow for species without images.
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

/* ── Species with generated images ─────────────────────────────── */
const SPECIES_WITH_IMAGES = new Set([
  "vaquita", "amur-leopard", "sumatran-rhino", "pangolin", "saola",
  "javan-rhino", "snow-leopard", "red-panda", "okapi", "saiga-antelope",
  "axolotl", "narwhal", "black-footed-ferret", "iberian-lynx",
  "pygmy-sloth", "ethiopian-wolf", "northern-hairy-nosed-wombat",
]);

/* ── Glow particles ──────────────────────────────────────────── */
function CreatureParticles({ color, radius, count = 120 }: { color: string; radius: number; count?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.6 + Math.random() * 0.8);
      pts[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, [radius, count]);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.08;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color={color}
        size={0.02}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Glowing ring around the image ───────────────────────────── */
function GlowRing({ color, radius }: { color: string; radius: number }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.z = t * 0.15;
      const scale = 1 + Math.sin(t * 1.2) * 0.05;
      ref.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -0.05]}>
      <ringGeometry args={[radius * 0.95, radius * 1.05, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.35}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ── Image-based creature (photorealistic) ───────────────────── */
function ImageCreature({ speciesId, color, detail }: { speciesId: string; color: string; detail?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const [hasError, setHasError] = useState(false);

  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const tex = new THREE.TextureLoader().load(
      `/species-images/${speciesId}.png`,
      undefined,
      undefined,
      () => setHasError(true)
    );
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [speciesId]);

  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.getElapsedTime();
      group.current.rotation.y = Math.sin(t * 0.3) * 0.15;
      group.current.position.y = Math.sin(t * 0.7) * 0.06;
    }
  });

  if (hasError || !texture) return null;

  const size = detail ? 2.8 : 1.8;

  return (
    <group ref={group}>
      {/* Main image plane */}
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle back-glow plane */}
      <mesh position={[0, 0, -0.08]}>
        <circleGeometry args={[size * 0.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Glow ring */}
      <GlowRing color={color} radius={size * 0.55} />

      {/* Particle aura */}
      <CreatureParticles
        color={color}
        radius={detail ? 2.2 : 1.4}
        count={detail ? 200 : 80}
      />
    </group>
  );
}

/* ── Emoji-based fallback creature (stylized glow) ───────────── */
function EmojiCreature({ emoji, color, secondaryColor, bodyType, detail }: {
  emoji: string;
  color: string;
  secondaryColor: string;
  bodyType: string;
  detail?: boolean;
}) {
  const group = useRef<THREE.Group>(null!);

  // Create emoji texture on canvas
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Radial gradient background glow
    const gradient = ctx.createRadialGradient(256, 256, 30, 256, 256, 256);
    const c = new THREE.Color(color);
    gradient.addColorStop(0, `rgba(${Math.floor(c.r*255)}, ${Math.floor(c.g*255)}, ${Math.floor(c.b*255)}, 0.35)`);
    gradient.addColorStop(0.5, `rgba(${Math.floor(c.r*255)}, ${Math.floor(c.g*255)}, ${Math.floor(c.b*255)}, 0.08)`);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Large emoji
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "220px serif";
    ctx.fillText(emoji, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [emoji, color]);

  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.getElapsedTime();
      group.current.rotation.y = Math.sin(t * 0.35) * 0.2;
      group.current.position.y = Math.sin(t * 0.65) * 0.06;
    }
  });

  if (!texture) return null;

  const size = detail ? 2.8 : 2.0;

  return (
    <group ref={group}>
      {/* Emoji image plane */}
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={texture}
          transparent
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Glow ring */}
      <GlowRing color={color} radius={size * 0.45} />

      {/* Particle aura */}
      <CreatureParticles
        color={color}
        radius={detail ? 2.0 : 1.2}
        count={detail ? 150 : 60}
      />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — Routes to image or emoji based on availability
   ═══════════════════════════════════════════════════════════════ */
export default function ProceduralCreature({ bodyType, bodyParams, detail = false, speciesId, emoji }: Props) {
  const hasImage = speciesId && SPECIES_WITH_IMAGES.has(speciesId);

  if (hasImage) {
    return (
      <ImageCreature
        speciesId={speciesId}
        color={bodyParams.primaryColor}
        detail={detail}
      />
    );
  }

  return (
    <EmojiCreature
      emoji={emoji || "🌿"}
      color={bodyParams.primaryColor}
      secondaryColor={bodyParams.secondaryColor}
      bodyType={bodyType}
      detail={detail}
    />
  );
}
