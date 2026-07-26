import { MicroscopeSlide, MicroscopeState, ObjectiveLens, MeasurementCaliper, AnnotationPin, CellStructure } from './types';

export const OBJECTIVE_MAGNIFICATION: Record<ObjectiveLens, number> = {
  '4x': 4,
  '10x': 10,
  '40x': 40,
  '100x': 100
};

export const OBJECTIVE_FOV_MICRONS: Record<ObjectiveLens, number> = {
  '4x': 4500,  // 4.5 mm
  '10x': 1800,  // 1.8 mm
  '40x': 450,   // 450 µm
  '100x': 180   // 180 µm
};

export function calculateEffectiveMagnification(objective: ObjectiveLens, digitalZoom: number): number {
  const opticalMag = OBJECTIVE_MAGNIFICATION[objective] * 10; // 10x ocular eyepiece lens
  return Math.round(opticalMag * digitalZoom);
}

export function calculateScaleBar(objective: ObjectiveLens, digitalZoom: number, canvasWidth: number): { label: string; widthPx: number; microns: number } {
  const fovMicrons = OBJECTIVE_FOV_MICRONS[objective] / digitalZoom;
  const pixelsPerMicron = canvasWidth / fovMicrons;

  let targetMicrons = 1000;
  if (fovMicrons < 300) targetMicrons = 20;
  else if (fovMicrons < 800) targetMicrons = 50;
  else if (fovMicrons < 2000) targetMicrons = 200;
  else targetMicrons = 500;

  const widthPx = Math.max(30, targetMicrons * pixelsPerMicron);
  const label = targetMicrons >= 1000 ? `${targetMicrons / 1000} mm` : `${targetMicrons} µm`;

  return { label, widthPx, microns: targetMicrons };
}

export function drawMicroscopeViewport(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  slide: MicroscopeSlide,
  state: MicroscopeState,
  caliper: MeasurementCaliper | null,
  annotations: AnnotationPin[]
) {
  // 1. Clear background & Apply Field of View Circular Mask
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Background aperture vignette
  ctx.fillStyle = '#020402';
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.46;

  // Clip to circular microscope ocular aperture
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  // 2. Base Slide Fill
  ctx.fillStyle = slide.proceduralConfig.bgGlowColor || '#f8fafc';
  ctx.fill();

  // 3. Setup Transform Matrix for Pan, Tilt & Objective Scaling
  const objMagScale = OBJECTIVE_MAGNIFICATION[state.objective] / 4; // 4x is base 1.0
  const zoomScale = objMagScale * state.digitalZoom;

  const stageOffsetX = (state.stageX / 100) * (width * 0.4);
  const stageOffsetY = (state.stageY / 100) * (height * 0.4);

  ctx.save();
  ctx.translate(centerX + stageOffsetX, centerY + stageOffsetY);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.scale(zoomScale, zoomScale);

  // 4. Calculate Depth-of-Field Blur from Focus Knobs
  const idealFineFocus = 50;
  const focusDiff = Math.abs(state.fineFocus - idealFineFocus) * 0.15 + Math.abs(state.coarseFocus - 50) * 0.3;
  const blurRadius = Math.min(25, focusDiff);

  if (blurRadius > 0.5) {
    ctx.filter = `blur(${blurRadius}px) brightness(${state.brightness}%) contrast(${state.contrast}%)`;
  } else {
    ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)`;
  }

  // 5. Draw Procedural Slide Pattern
  drawSlidePattern(ctx, width, height, slide, state);

  // 6. Draw Cellular Structures
  slide.cellularStructures.forEach((struct) => {
    const isSelected = state.selectedStructureId === struct.id;
    drawCellStructure(ctx, width, height, struct, isSelected, state);
  });

  ctx.restore(); // Restore transform matrix
  ctx.filter = 'none';

  // 7. Apply Optical Filters (HE Stain, Fluorescent GFP, Darkfield, Phase Contrast)
  applyOpticalFilterOverlay(ctx, centerX, centerY, radius, state.opticalFilter);

  // 8. Oil Immersion Lens Overlay Effect for 100x
  if (state.objective === '100x') {
    drawOilImmersionEffect(ctx, centerX, centerY, radius, state.oilImmersionApplied);
  }

  // 9. Draw Aperture Vignette Edge & Crosshairs
  drawApertureOverlay(ctx, centerX, centerY, radius);

  // 10. Draw Measurement Caliper if active
  if (caliper && caliper.active) {
    drawMeasurementCaliper(ctx, caliper, state, width);
  }

  // 11. Draw Callout Pins / Labels if enabled
  if (state.showLabels || state.showAnnotations) {
    drawCalloutPins(ctx, centerX, centerY, stageOffsetX, stageOffsetY, zoomScale, slide, annotations, state);
  }

  ctx.restore(); // Restore circular clip mask
}

function drawSlidePattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  slide: MicroscopeSlide,
  state: MicroscopeState
) {
  const { primaryColor, secondaryColor, patternType, density } = slide.proceduralConfig;

  const count = density * 2;
  const stepX = width / Math.sqrt(count);
  const stepY = height / Math.sqrt(count);

  ctx.lineWidth = 1.5;

  if (patternType === 'plant_stomata' || patternType === 'cellular_network') {
    ctx.strokeStyle = primaryColor;
    ctx.fillStyle = secondaryColor;
    for (let x = -width; x < width; x += stepX * 1.2) {
      for (let y = -height; y < height; y += stepY * 1.2) {
        ctx.beginPath();
        ctx.ellipse(x, y, stepX * 0.5, stepY * 0.35, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner nucleus dot
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(x + stepX * 0.1, y + stepY * 0.05, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = secondaryColor;
      }
    }
  } else if (patternType === 'blood_cells') {
    // Erythrocytes round pink discs
    for (let x = -width * 1.2; x < width * 1.2; x += stepX * 0.8) {
      for (let y = -height * 1.2; y < height * 1.2; y += stepY * 0.8) {
        const jitterX = Math.sin(x * 0.05 + y) * 12;
        const jitterY = Math.cos(y * 0.05 + x) * 12;
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(x + jitterX, y + jitterY, stepX * 0.28, 0, Math.PI * 2);
        ctx.fill();

        // Biconcave central pallor
        ctx.fillStyle = secondaryColor;
        ctx.beginPath();
        ctx.arc(x + jitterX, y + jitterY, stepX * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (patternType === 'striated_fibers') {
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4;
    for (let y = -height; y < height; y += 14) {
      ctx.beginPath();
      ctx.moveTo(-width, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (patternType === 'osteon_rings') {
    // Concentric osteon lamellae rings
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1.2;
    const centers = [
      { x: -width * 0.25, y: -height * 0.25 },
      { x: width * 0.25, y: height * 0.25 },
      { x: 0, y: 0 }
    ];
    centers.forEach(c => {
      for (let r = 20; r < 240; r += 16) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  } else {
    // Default organic texture mesh
    ctx.fillStyle = primaryColor;
    ctx.globalAlpha = 0.4;
    for (let x = -width; x < width; x += stepX * 1.5) {
      for (let y = -height; y < height; y += stepY * 1.5) {
        ctx.beginPath();
        ctx.arc(x, y, stepX * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;
  }
}

function drawCellStructure(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  struct: CellStructure,
  isSelected: boolean,
  state: MicroscopeState
) {
  // Map normalized 0..1 to canvas space centered at origin
  const posX = (struct.x - 0.5) * width * 1.2;
  const posY = (struct.y - 0.5) * height * 1.2;
  const size = struct.radius * Math.min(width, height);

  ctx.save();
  ctx.beginPath();
  ctx.arc(posX, posY, size, 0, Math.PI * 2);

  ctx.fillStyle = struct.color;
  ctx.globalAlpha = 0.85;
  ctx.fill();

  ctx.lineWidth = isSelected ? 3.5 : 1.5;
  ctx.strokeStyle = isSelected ? '#38bdf8' : 'rgba(255,255,255,0.8)';
  ctx.stroke();

  if (isSelected) {
    // Selection pulse ring
    ctx.beginPath();
    ctx.arc(posX, posY, size + 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
  }

  ctx.restore();
}

function applyOpticalFilterOverlay(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  filter: MicroscopeState['opticalFilter']
) {
  if (filter === 'normal') return;

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';

  if (filter === 'he_stain') {
    ctx.fillStyle = 'rgba(219, 39, 119, 0.25)'; // Pink/purple eosin tint
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else if (filter === 'fluorescent') {
    ctx.globalCompositeOperation = 'difference';
    ctx.fillStyle = 'rgba(34, 197, 94, 0.45)'; // GFP green emission
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else if (filter === 'darkfield') {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; // Darkfield contrast background
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else if (filter === 'phase_contrast') {
    ctx.globalCompositeOperation = 'color-burn';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  } else if (filter === 'polarized') {
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
  }

  ctx.restore();
}

function drawOilImmersionEffect(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  isApplied: boolean
) {
  if (!isApplied) {
    // Severe refractive air-gap distortion when oil is missing at 100x
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ Immersion Oil Required for 100x Objective', centerX, centerY + radius * 0.7);
    ctx.restore();
  } else {
    // Subtle viscous oil meniscus sheen indicator
    ctx.save();
    const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.2)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawApertureOverlay(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
  ctx.save();

  // Outer dark rim vignette shadow
  const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.88, centerX, centerY, radius);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(0.9, 'rgba(0, 0, 0, 0.7)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Subtle microscope reticle / crosshair center marker
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);

  ctx.beginPath();
  ctx.moveTo(centerX - 18, centerY);
  ctx.lineTo(centerX + 18, centerY);
  ctx.moveTo(centerX, centerY - 18);
  ctx.lineTo(centerX, centerY + 18);
  ctx.stroke();

  ctx.restore();
}

function drawMeasurementCaliper(
  ctx: CanvasRenderingContext2D,
  caliper: MeasurementCaliper,
  state: MicroscopeState,
  canvasWidth: number
) {
  const fovMicrons = OBJECTIVE_FOV_MICRONS[state.objective] / state.digitalZoom;
  const pixelsPerMicron = canvasWidth / fovMicrons;

  const dx = caliper.endX - caliper.startX;
  const dy = caliper.endY - caliper.startY;
  const distPx = Math.sqrt(dx * dx + dy * dy);
  const distMicrons = Math.round(distPx / pixelsPerMicron);

  ctx.save();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#38bdf8';

  // Draw line between endpoints
  ctx.beginPath();
  ctx.moveTo(caliper.startX, caliper.startY);
  ctx.lineTo(caliper.endX, caliper.endY);
  ctx.stroke();

  // Draw endpoint caps
  ctx.beginPath();
  ctx.arc(caliper.startX, caliper.startY, 4, 0, Math.PI * 2);
  ctx.arc(caliper.endX, caliper.endY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Distance label
  const midX = (caliper.startX + caliper.endX) / 2;
  const midY = (caliper.startY + caliper.endY) / 2;

  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;

  const labelText = `${distMicrons} µm`;
  ctx.font = 'bold 12px monospace';
  const textWidth = ctx.measureText(labelText).width;

  ctx.fillRect(midX - textWidth / 2 - 8, midY - 14, textWidth + 16, 22);
  ctx.strokeRect(midX - textWidth / 2 - 8, midY - 14, textWidth + 16, 22);

  ctx.fillStyle = '#38bdf8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(labelText, midX, midY - 3);

  ctx.restore();
}

function drawCalloutPins(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  stageOffsetX: number,
  stageOffsetY: number,
  zoomScale: number,
  slide: MicroscopeSlide,
  annotations: AnnotationPin[],
  state: MicroscopeState
) {
  ctx.save();
  ctx.font = 'bold 11px system-ui, sans-serif';

  slide.cellularStructures.forEach((struct) => {
    const isSelected = state.selectedStructureId === struct.id;
    const structX = (struct.x - 0.5) * (centerX * 2) * 1.2 * zoomScale;
    const structY = (struct.y - 0.5) * (centerY * 2) * 1.2 * zoomScale;

    const screenX = centerX + stageOffsetX + structX;
    const screenY = centerY + stageOffsetY + structY;

    if (state.showLabels || isSelected) {
      ctx.fillStyle = isSelected ? '#38bdf8' : 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = isSelected ? '#ffffff' : '#38bdf8';
      ctx.lineWidth = 1;

      const text = struct.name;
      const textWidth = ctx.measureText(text).width;

      ctx.beginPath();
      ctx.roundRect(screenX - textWidth / 2 - 6, screenY - 26, textWidth + 12, 20, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSelected ? '#020617' : '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, screenX, screenY - 16);
    }
  });

  ctx.restore();
}
