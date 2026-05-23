// ============================================
// ZORRO — Color Engine
// Generación profesional de paletas
// ============================================

// HSL to HEX
export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r, g, b;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// HEX to HSL
export function hexToHsl(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0, s = 0, l = (max + min) / 2;

  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// HEX to RGB
export function hexToRgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

// Contrast ratio (WCAG)
export function getContrast(hex1, hex2) {
  const lum = (hex) => {
    const rgb = hexToRgb(hex);
    const vals = [rgb.r, rgb.g, rgb.b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * vals[0] + 0.7152 * vals[1] + 0.0722 * vals[2];
  };
  const l1 = lum(hex1), l2 = lum(hex2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2);
}

// Random int
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random hue
function randHue() {
  return randInt(0, 359);
}

// === ROLE DEFINITIONS ===
export const ROLES = [
  { key: 'background', label: 'Fondo principal', emoji: '🎨', desc: 'Background del body/app' },
  { key: 'surface', label: 'Superficie / Cards', emoji: '📋', desc: 'Background de tarjetas, modales' },
  { key: 'primary', label: 'Color primario', emoji: '🔵', desc: 'Botones principales, CTAs, links' },
  { key: 'secondary', label: 'Color secundario', emoji: '🟣', desc: 'Botones secundarios, badges' },
  { key: 'accent', label: 'Acento / Highlight', emoji: '✨', desc: 'Hover, focus, elementos destacados' },
  { key: 'text', label: 'Texto principal', emoji: '📝', desc: 'Títulos y texto de cuerpo' },
  { key: 'textSecondary', label: 'Texto secundario', emoji: '💬', desc: 'Subtítulos, placeholders, hints' },
  { key: 'border', label: 'Bordes / Divisores', emoji: '📏', desc: 'Bordes de inputs, líneas divisoras' },
  { key: 'success', label: 'Éxito / Positivo', emoji: '✅', desc: 'Confirmaciones, estados correctos' },
  { key: 'danger', label: 'Error / Peligro', emoji: '❌', desc: 'Errores, alertas, destructivos' },
  { key: 'warning', label: 'Advertencia', emoji: '⚠️', desc: 'Warnings, pendientes' },
];

// === HARMONY ALGORITHMS ===

// Complementary (opposite on wheel)
function complementary(baseHue) {
  return [(baseHue + 180) % 360];
}

// Analogous (neighbors)
function analogous(baseHue, count = 2) {
  const step = 30;
  const result = [];
  for (let i = 1; i <= count; i++) {
    result.push((baseHue + step * i) % 360);
    if (result.length < count) result.push((baseHue - step * i + 360) % 360);
  }
  return result.slice(0, count);
}

// Triadic
function triadic(baseHue) {
  return [(baseHue + 120) % 360, (baseHue + 240) % 360];
}

// Split complementary
function splitComplementary(baseHue) {
  return [(baseHue + 150) % 360, (baseHue + 210) % 360];
}

// Tetradic (rectangle)
function tetradic(baseHue) {
  return [(baseHue + 60) % 360, (baseHue + 180) % 360, (baseHue + 240) % 360];
}

// Square
function square(baseHue) {
  return [(baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
}

// Get harmony hues
export function getHarmonyHues(baseHue, harmony) {
  switch (harmony) {
    case 'complementary': return [baseHue, ...complementary(baseHue)];
    case 'analogous': return [baseHue, ...analogous(baseHue, 3)];
    case 'triadic': return [baseHue, ...triadic(baseHue)];
    case 'split': return [baseHue, ...splitComplementary(baseHue)];
    case 'tetradic': return [baseHue, ...tetradic(baseHue)];
    case 'square': return [baseHue, ...square(baseHue)];
    case 'monochromatic': return [baseHue];
    default: return [baseHue];
  }
}

// === PALETTE GENERATORS ===

export function generateDarkPalette(baseHue, harmony = 'complementary') {
  const hues = getHarmonyHues(baseHue, harmony);
  const h = hues[0];
  const h2 = hues[1] || (h + 180) % 360;
  const h3 = hues[2] || (h + 120) % 360;
  const h4 = hues[3] || (h + 60) % 360;

  return {
    background: { hex: hslToHex(h, 15, 6), role: ROLES[0] },
    surface: { hex: hslToHex(h, 12, 10), role: ROLES[1] },
    primary: { hex: hslToHex(h, 70, 55), role: ROLES[2] },
    secondary: { hex: hslToHex(h2, 60, 50), role: ROLES[3] },
    accent: { hex: hslToHex(h3, 80, 60), role: ROLES[4] },
    text: { hex: hslToHex(h, 10, 90), role: ROLES[5] },
    textSecondary: { hex: hslToHex(h, 10, 55), role: ROLES[6] },
    border: { hex: hslToHex(h, 12, 20), role: ROLES[7] },
    success: { hex: hslToHex(145, 65, 45), role: ROLES[8] },
    danger: { hex: hslToHex(0, 70, 50), role: ROLES[9] },
    warning: { hex: hslToHex(40, 80, 50), role: ROLES[10] },
  };
}

export function generateLightPalette(baseHue, harmony = 'complementary') {
  const hues = getHarmonyHues(baseHue, harmony);
  const h = hues[0];
  const h2 = hues[1] || (h + 180) % 360;
  const h3 = hues[2] || (h + 120) % 360;

  return {
    background: { hex: hslToHex(h, 20, 96), role: ROLES[0] },
    surface: { hex: hslToHex(h, 15, 100), role: ROLES[1] },
    primary: { hex: hslToHex(h, 70, 45), role: ROLES[2] },
    secondary: { hex: hslToHex(h2, 55, 42), role: ROLES[3] },
    accent: { hex: hslToHex(h3, 75, 50), role: ROLES[4] },
    text: { hex: hslToHex(h, 20, 12), role: ROLES[5] },
    textSecondary: { hex: hslToHex(h, 10, 40), role: ROLES[6] },
    border: { hex: hslToHex(h, 15, 82), role: ROLES[7] },
    success: { hex: hslToHex(145, 60, 38), role: ROLES[8] },
    danger: { hex: hslToHex(0, 65, 48), role: ROLES[9] },
    warning: { hex: hslToHex(35, 85, 48), role: ROLES[10] },
  };
}

export function generateRandomPalette(mode = 'dark', harmony = 'complementary') {
  const baseHue = randHue();
  return mode === 'dark'
    ? generateDarkPalette(baseHue, harmony)
    : generateLightPalette(baseHue, harmony);
}

export function generateFromHue(hue, mode = 'dark', harmony = 'complementary') {
  return mode === 'dark'
    ? generateDarkPalette(hue, harmony)
    : generateLightPalette(hue, harmony);
}

// === EXPORT FORMATS ===

export function paletteToCSS(palette, prefix = '') {
  const lines = Object.entries(palette).map(([key, val]) => {
    const varName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `  --${prefix}${varName}: ${val.hex}; /* ${val.role.label} — ${val.role.desc} */`;
  });
  return `:root {\n${lines.join('\n')}\n}`;
}

export function paletteToTailwind(palette) {
  const obj = {};
  Object.entries(palette).forEach(([key, val]) => {
    const k = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    obj[k] = `${val.hex} /* ${val.role.label} */`;
  });
  return JSON.stringify({ colors: obj }, null, 2);
}

export function paletteToText(palette) {
  return Object.entries(palette).map(([key, val]) => {
    const rgb = hexToRgb(val.hex);
    const hsl = hexToHsl(val.hex);
    return `${val.role.emoji} ${val.role.label}\n   HEX: ${val.hex}\n   RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n   HSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\n   Uso: ${val.role.desc}`;
  }).join('\n\n');
}

export function paletteToAIPrompt(palette) {
  const lines = Object.entries(palette).map(([key, val]) => {
    return `- ${val.role.label}: ${val.hex} → ${val.role.desc}`;
  });
  return `Paleta de colores para el proyecto:\n\n${lines.join('\n')}\n\nUsa estos colores exactos en el diseño. Cada color tiene un propósito específico asignado.`;
}

// === HARMONIES INFO ===
export const HARMONIES = [
  { key: 'complementary', label: 'Complementario', desc: 'Colores opuestos en el círculo', icon: '🔄' },
  { key: 'analogous', label: 'Análogo', desc: 'Colores vecinos, suave', icon: '🌈' },
  { key: 'triadic', label: 'Triádico', desc: 'Tres colores equidistantes', icon: '🔺' },
  { key: 'split', label: 'Complementario dividido', desc: 'Opuesto + vecinos', icon: '🔀' },
  { key: 'tetradic', label: 'Tetrádico', desc: 'Cuatro colores rectangulares', icon: '◆' },
  { key: 'square', label: 'Cuadrado', desc: 'Cuatro colores equidistantes', icon: '⬛' },
  { key: 'monochromatic', label: 'Monocromático', desc: 'Un solo tono, variando luz', icon: '🎯' },
];