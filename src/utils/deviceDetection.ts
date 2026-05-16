/**
 * Device-detection helpers used by 3D components to scale quality.
 *
 * All checks are wrapped so they work during SSR (Next.js server render)
 * where `window` / `navigator` are unavailable.
 */

/** Viewport narrower than 768 px */
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
};

/** Low-end device — fewer than 4 logical cores */
export const isLowEnd = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return navigator.hardwareConcurrency < 4;
};

/** Browser supports WebGL 2 */
export const supportsWebGL2 = (): boolean => {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
};

/** Returns a quality tier: "low" | "medium" | "high" */
export const getQualityTier = (): "low" | "medium" | "high" => {
  if (typeof window === "undefined") return "high";
  if (isLowEnd() || !supportsWebGL2()) return "low";
  if (isMobile()) return "medium";
  return "high";
};

/** Particle count scaled to device capability */
export const getParticleCount = (base: number): number => {
  const tier = getQualityTier();
  if (tier === "low") return Math.round(base * 0.2);
  if (tier === "medium") return Math.round(base * 0.5);
  return base;
};

/** Whether post-processing should be enabled */
export const shouldEnablePostProcessing = (): boolean => {
  return getQualityTier() === "high";
};
