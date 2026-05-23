import { hexToRgb, hexToHsl, getContrast } from '../engine/colors';

export default function PaletteCard({ colorKey, colorData, onCopy }) {
  const { hex, role } = colorData;
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  const isLight = hsl.l > 60;

  const handleCopy = (text) => {
    if (window.electronAPI?.copyToClipboard) {
      window.electronAPI.copyToClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    onCopy?.(text);
  };

  return (
    <div className="palette-card">
      <div
        className="palette-swatch"
        style={{ background: hex }}
        onClick={() => handleCopy(hex)}
        title="Click para copiar HEX"
      >
        <span className="swatch-text" style={{ color: isLight ? '#000' : '#fff' }}>
          {hex}
        </span>
      </div>
      <div className="palette-info">
        <div className="palette-role">
          <span className="role-emoji">{role.emoji}</span>
          <span className="role-label">{role.label}</span>
        </div>
        <div className="palette-desc">{role.desc}</div>
        <div className="palette-formats">
          <button className="fmt-btn" onClick={() => handleCopy(hex)} title="Copiar HEX">HEX</button>
          <button className="fmt-btn" onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} title="Copiar RGB">RGB</button>
          <button className="fmt-btn" onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} title="Copiar HSL">HSL</button>
        </div>
      </div>
    </div>
  );
}