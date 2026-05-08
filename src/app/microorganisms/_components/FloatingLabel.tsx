"use client";
import { Html } from "@react-three/drei";

export default function FloatingLabel({ position, title, description, color, dotOffset }: {
  position: [number, number, number]; title: string; description: string; color: string; dotOffset?: [number, number, number];
}) {
  return (
    <group position={position}>
      {dotOffset && (<mesh position={dotOffset}><sphereGeometry args={[0.04, 8, 8]} /><meshBasicMaterial color={color} /></mesh>)}
      <Html center distanceFactor={6} style={{ pointerEvents: "none", userSelect: "none" }}>
        <div style={{ background: "rgba(5,10,5,0.88)", backdropFilter: "blur(14px)", border: `1px solid ${color}40`, borderRadius: "12px", padding: "12px 16px", minWidth: "150px", maxWidth: "210px", textAlign: "center" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color, letterSpacing: "0.06em", marginBottom: "4px", textShadow: `0 0 12px ${color}60` }}>{title}</div>
          <div style={{ fontSize: "0.62rem", color: "rgba(200,245,200,0.7)", lineHeight: 1.5 }}>{description}</div>
        </div>
      </Html>
    </group>
  );
}
