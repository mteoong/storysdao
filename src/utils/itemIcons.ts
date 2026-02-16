// Programmatic item icon generator using Canvas 2D API
// Each item gets a unique, recognizable icon drawn at 64x64
// Returns cached data: URLs for use as <img> src

const ICON_SIZE = 64;
const iconCache: Map<string, string> = new Map();

type DrawFn = (ctx: CanvasRenderingContext2D, s: number, color: string) => void;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const f = 1 - amount;
  return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
}

function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.min(255, Math.round(r + (255 - r) * amount))},${Math.min(255, Math.round(g + (255 - g) * amount))},${Math.min(255, Math.round(b + (255 - b) * amount))})`;
}

// 1: Diamond Sword
function drawSword(ctx: CanvasRenderingContext2D, s: number, color: string) {
  const cx = s / 2;
  ctx.save();
  ctx.translate(cx, cx);
  ctx.rotate(-Math.PI / 4);

  // Blade
  ctx.fillStyle = color;
  ctx.fillRect(-3, -24, 6, 30);
  // Blade highlight
  ctx.fillStyle = lighten(color, 0.4);
  ctx.fillRect(-1, -24, 2, 28);
  // Blade tip
  ctx.beginPath();
  ctx.moveTo(-3, -24);
  ctx.lineTo(0, -30);
  ctx.lineTo(3, -24);
  ctx.fillStyle = lighten(color, 0.2);
  ctx.fill();

  // Crossguard
  ctx.fillStyle = darken(color, 0.3);
  ctx.fillRect(-10, 5, 20, 4);

  // Handle
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(-2, 9, 4, 14);
  // Handle wrap
  ctx.fillStyle = "#A0522D";
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(-3, 10 + i * 4, 6, 2);
  }

  // Pommel
  ctx.fillStyle = darken(color, 0.2);
  ctx.beginPath();
  ctx.arc(0, 25, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 2: Rocket Boots
function drawBoots(ctx: CanvasRenderingContext2D, s: number, color: string) {
  ctx.save();
  ctx.translate(s / 2, s / 2 + 4);

  // Boot body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-8, -14);
  ctx.lineTo(4, -14);
  ctx.lineTo(4, 0);
  ctx.lineTo(14, 0);
  ctx.lineTo(14, 8);
  ctx.lineTo(-8, 8);
  ctx.closePath();
  ctx.fill();

  // Boot dark edge
  ctx.fillStyle = darken(color, 0.3);
  ctx.fillRect(-8, 6, 22, 3);

  // Metallic stripe
  ctx.fillStyle = lighten(color, 0.5);
  ctx.fillRect(-6, -10, 2, 14);

  // Flames
  const flames = [
    { x: -4, h: 10 },
    { x: 0, h: 14 },
    { x: 4, h: 11 },
    { x: 8, h: 8 },
  ];
  for (const f of flames) {
    const grad = ctx.createLinearGradient(f.x, 8, f.x, 8 + f.h);
    grad.addColorStop(0, "#FBBF24");
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(f.x - 2, 8);
    ctx.lineTo(f.x, 8 + f.h);
    ctx.lineTo(f.x + 2, 8);
    ctx.fill();
  }

  ctx.restore();
}

// 3: Shadow Cape
function drawCape(ctx: CanvasRenderingContext2D, s: number, color: string) {
  ctx.save();
  ctx.translate(s / 2, s / 2);

  // Cape body
  const grad = ctx.createLinearGradient(0, -22, 0, 22);
  grad.addColorStop(0, lighten(color, 0.2));
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, darken(color, 0.4));
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(-14, -22);
  ctx.lineTo(14, -22);
  ctx.quadraticCurveTo(16, 0, 12, 18);
  ctx.quadraticCurveTo(8, 24, 4, 22);
  ctx.quadraticCurveTo(0, 26, -4, 22);
  ctx.quadraticCurveTo(-8, 24, -12, 18);
  ctx.quadraticCurveTo(-16, 0, -14, -22);
  ctx.fill();

  // Collar
  ctx.fillStyle = darken(color, 0.2);
  ctx.beginPath();
  ctx.ellipse(0, -20, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Inner fold line
  ctx.strokeStyle = darken(color, 0.3);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.quadraticCurveTo(1, 4, 0, 20);
  ctx.stroke();

  // Sparkle
  ctx.fillStyle = lighten(color, 0.6);
  ctx.beginPath();
  ctx.arc(-6, -8, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(8, 2, 1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4: Crystal Pickaxe
function drawPickaxe(ctx: CanvasRenderingContext2D, s: number, color: string) {
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate(-Math.PI / 6);

  // Handle
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(-2, -6, 4, 30);
  ctx.fillStyle = "#A0522D";
  ctx.fillRect(-2, 2, 4, 2);
  ctx.fillRect(-2, 8, 4, 2);

  // Pick head - left
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-2, -6);
  ctx.lineTo(-20, -14);
  ctx.lineTo(-18, -8);
  ctx.lineTo(-2, -2);
  ctx.fill();

  // Pick head - right
  ctx.beginPath();
  ctx.moveTo(2, -6);
  ctx.lineTo(20, -14);
  ctx.lineTo(18, -8);
  ctx.lineTo(2, -2);
  ctx.fill();

  // Crystal facets
  ctx.fillStyle = lighten(color, 0.4);
  ctx.beginPath();
  ctx.moveTo(-4, -6);
  ctx.lineTo(-14, -12);
  ctx.lineTo(-12, -8);
  ctx.lineTo(-4, -4);
  ctx.fill();

  ctx.fillStyle = lighten(color, 0.3);
  ctx.beginPath();
  ctx.moveTo(4, -6);
  ctx.lineTo(14, -12);
  ctx.lineTo(12, -8);
  ctx.lineTo(4, -4);
  ctx.fill();

  ctx.restore();
}

// 5: Neon Halo
function drawHalo(ctx: CanvasRenderingContext2D, s: number, color: string) {
  const cx = s / 2;
  const cy = s / 2;

  // Outer glow
  const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 28);
  glowGrad.addColorStop(0, color + "40");
  glowGrad.addColorStop(1, "transparent");
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fill();

  // Ring
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 18, 12, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Highlight
  ctx.strokeStyle = lighten(color, 0.5);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 18, 12, 0, -0.8, 0.3);
  ctx.stroke();

  // Inner glow
  ctx.strokeStyle = lighten(color, 0.3);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(cx, cy, 15, 10, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Sparkles
  ctx.fillStyle = lighten(color, 0.7);
  const sparkles = [
    [cx - 16, cy - 6],
    [cx + 14, cy + 4],
    [cx, cy - 14],
    [cx - 8, cy + 10],
  ];
  for (const [sx, sy] of sparkles) {
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 6: Builder's Hammer
function drawHammer(ctx: CanvasRenderingContext2D, s: number, color: string) {
  ctx.save();
  ctx.translate(s / 2, s / 2);
  ctx.rotate(-Math.PI / 5);

  // Handle
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(-2, -4, 4, 28);
  ctx.fillStyle = "#A0522D";
  ctx.fillRect(-2, 6, 4, 2);
  ctx.fillRect(-2, 12, 4, 2);

  // Hammer head
  ctx.fillStyle = color;
  ctx.fillRect(-14, -12, 28, 10);

  // Hammer face (front)
  ctx.fillStyle = lighten(color, 0.3);
  ctx.fillRect(-14, -12, 6, 10);
  ctx.fillStyle = darken(color, 0.2);
  ctx.fillRect(8, -12, 6, 10);

  // Top highlight
  ctx.fillStyle = lighten(color, 0.15);
  ctx.fillRect(-12, -12, 24, 2);

  ctx.restore();
}

// 7: Fire Wings
function drawWings(ctx: CanvasRenderingContext2D, s: number, color: string) {
  ctx.save();
  ctx.translate(s / 2, s / 2 + 2);

  // Left wing
  const drawWing = (flip: number) => {
    ctx.save();
    ctx.scale(flip, 1);

    const grad = ctx.createLinearGradient(0, 0, 22, -10);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, lighten(color, 0.3));
    grad.addColorStop(1, "#FBBF24");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(2, 4);
    ctx.quadraticCurveTo(8, -20, 22, -18);
    ctx.quadraticCurveTo(26, -10, 24, -4);
    ctx.quadraticCurveTo(20, -8, 18, -2);
    ctx.quadraticCurveTo(16, -6, 14, 2);
    ctx.quadraticCurveTo(12, -2, 10, 6);
    ctx.quadraticCurveTo(6, 4, 2, 10);
    ctx.closePath();
    ctx.fill();

    // Feather lines
    ctx.strokeStyle = darken(color, 0.2);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.quadraticCurveTo(12, -10, 20, -12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, 4);
    ctx.quadraticCurveTo(10, -4, 18, -4);
    ctx.stroke();

    ctx.restore();
  };

  drawWing(1);  // Right wing
  drawWing(-1); // Left wing (mirrored)

  // Center body dot
  ctx.fillStyle = darken(color, 0.3);
  ctx.beginPath();
  ctx.arc(0, 4, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 8: Stone Shield
function drawShield(ctx: CanvasRenderingContext2D, s: number, color: string) {
  const cx = s / 2;
  const cy = s / 2;

  // Shield shape
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 24);
  ctx.quadraticCurveTo(cx + 22, cy - 20, cx + 20, cy);
  ctx.quadraticCurveTo(cx + 16, cy + 16, cx, cy + 24);
  ctx.quadraticCurveTo(cx - 16, cy + 16, cx - 20, cy);
  ctx.quadraticCurveTo(cx - 22, cy - 20, cx, cy - 24);
  ctx.fill();

  // Border
  ctx.strokeStyle = darken(color, 0.3);
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 24);
  ctx.quadraticCurveTo(cx + 22, cy - 20, cx + 20, cy);
  ctx.quadraticCurveTo(cx + 16, cy + 16, cx, cy + 24);
  ctx.quadraticCurveTo(cx - 16, cy + 16, cx - 20, cy);
  ctx.quadraticCurveTo(cx - 22, cy - 20, cx, cy - 24);
  ctx.stroke();

  // Cross emblem
  ctx.fillStyle = darken(color, 0.15);
  ctx.fillRect(cx - 2, cy - 14, 4, 24);
  ctx.fillRect(cx - 10, cy - 6, 20, 4);

  // Highlight
  ctx.fillStyle = lighten(color, 0.2);
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 18);
  ctx.quadraticCurveTo(cx - 6, cy - 8, cx - 8, cy);
  ctx.lineTo(cx - 12, cy);
  ctx.quadraticCurveTo(cx - 14, cy - 10, cx - 8, cy - 18);
  ctx.fill();
}

// Fallback: colored rounded square with item initial
function drawFallback(ctx: CanvasRenderingContext2D, s: number, color: string) {
  ctx.fillStyle = color;
  const r = 8;
  const m = 8;
  ctx.beginPath();
  ctx.roundRect(m, m, s - m * 2, s - m * 2, r);
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.font = `bold ${s / 3}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("?", s / 2, s / 2);
}

const ICON_DRAWERS: Record<string, DrawFn> = {
  "1": drawSword,
  "2": drawBoots,
  "3": drawCape,
  "4": drawPickaxe,
  "5": drawHalo,
  "6": drawHammer,
  "7": drawWings,
  "8": drawShield,
};

export function getItemIconUrl(itemId: string, color: string): string {
  const key = `${itemId}-${color}`;
  if (iconCache.has(key)) return iconCache.get(key)!;

  const canvas = document.createElement("canvas");
  canvas.width = ICON_SIZE;
  canvas.height = ICON_SIZE;
  const ctx = canvas.getContext("2d")!;

  const drawer = ICON_DRAWERS[itemId] || drawFallback;
  drawer(ctx, ICON_SIZE, color);

  const url = canvas.toDataURL();
  iconCache.set(key, url);
  return url;
}
