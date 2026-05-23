import { paletteToCSS, paletteToTailwind, paletteToText, paletteToAIPrompt } from '../engine/colors';

export default function ExportPanel({ palette, onCopy }) {
  const formats = [
    { key: 'css', label: '🎨 CSS Variables', fn: () => paletteToCSS(palette) },
    { key: 'tailwind', label: '🌊 Tailwind Config', fn: () => paletteToTailwind(palette) },
    { key: 'text', label: '📝 Texto completo', fn: () => paletteToText(palette) },
    { key: 'ai', label: '🤖 Prompt para IA', fn: () => paletteToAIPrompt(palette) },
  ];

  const handleExport = (fn) => {
    const text = fn();
    if (window.electronAPI?.copyToClipboard) {
      window.electronAPI.copyToClipboard(text);
    } else {
      navigator.clipboard.writeText(text);
    }
    onCopy?.('Copiado al portapapeles');
  };

  return (
    <div className="export-panel">
      <div className="export-title">📋 Exportar paleta</div>
      <div className="export-buttons">
        {formats.map((f) => (
          <button key={f.key} className="export-btn" onClick={() => handleExport(f.fn)}>
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}