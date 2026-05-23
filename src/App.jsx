import { useState, useEffect, useCallback } from 'react';
import TitleBar from './components/TitleBar';
import ChromaWheel from './components/ChromaWheel';
import PaletteCard from './components/PaletteCard';
import ExportPanel from './components/ExportPanel';
import Toast from './components/Toast';
import {
  generateFromHue,
  generateRandomPalette,
  getHarmonyHues,
  HARMONIES,
} from './engine/colors';

export default function App() {
  const [logo, setLogo] = useState(null);
  const [hue, setHue] = useState(25);
  const [mode, setMode] = useState('dark');
  const [harmony, setHarmony] = useState('complementary');
  const [palette, setPalette] = useState(() => generateFromHue(25, 'dark', 'complementary'));
  const [toast, setToast] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    window.electronAPI?.getLogo().then((l) => l && setLogo(l));
  }, []);

  const regenerate = useCallback((h, m, har) => {
    const p = generateFromHue(h, m, har);
    setPalette(p);
    setHistory((prev) => [...prev.slice(-19), { hue: h, mode: m, harmony: har, palette: p }]);
  }, []);

  useEffect(() => { regenerate(hue, mode, harmony); }, [hue, mode, harmony]);

  const handleRandom = () => {
    const newHue = Math.floor(Math.random() * 360);
    setHue(newHue);
  };

  const showToast = useCallback((msg) => setToast(msg), []);
  const harmonyHues = getHarmonyHues(hue, harmony);

  return (
    <div className="app">
      <TitleBar logo={logo} />
      <div className="app-body">
        {/* LEFT PANEL */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-brand">
              {logo ? <img src={logo} alt="Z" className="sidebar-logo" /> : <span className="sidebar-emoji">🦊</span>}
            </div>
          </div>

          <div className="sidebar-section">
            <label className="section-label">Círculo Cromático</label>
            <ChromaWheel hue={hue} onHueChange={setHue} harmonyHues={harmonyHues} />
          </div>

          <div className="sidebar-section">
            <label className="section-label">Armonía</label>
            <div className="harmony-grid">
              {HARMONIES.map((h) => (
                <button
                  key={h.key}
                  className={`harmony-btn ${harmony === h.key ? 'active' : ''}`}
                  onClick={() => setHarmony(h.key)}
                  title={h.desc}
                >
                  <span>{h.icon}</span>
                  <span>{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <label className="section-label">Modo</label>
            <div className="mode-toggle">
              <button className={`mode-btn ${mode === 'dark' ? 'active' : ''}`} onClick={() => setMode('dark')}>🌙 Oscuro</button>
              <button className={`mode-btn ${mode === 'light' ? 'active' : ''}`} onClick={() => setMode('light')}>☀️ Claro</button>
            </div>
          </div>

          <button className="btn-random" onClick={handleRandom}>🎲 Aleatorio</button>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          <div className="main-header">
            <h1>🎨 Paleta generada</h1>
            <p>Hue: {hue}° • {HARMONIES.find((h) => h.key === harmony)?.label} • {mode === 'dark' ? 'Oscuro' : 'Claro'}</p>
          </div>

          {/* Preview bar */}
          <div className="preview-bar">
            {Object.entries(palette).map(([key, val]) => (
              <div
                key={key}
                className="preview-segment"
                style={{ background: val.hex }}
                title={`${val.role.label}: ${val.hex}`}
              />
            ))}
          </div>

          {/* Cards grid */}
          <div className="palette-grid">
            {Object.entries(palette).map(([key, val]) => (
              <PaletteCard key={key} colorKey={key} colorData={val} onCopy={showToast} />
            ))}
          </div>

          {/* Export */}
          <ExportPanel palette={palette} onCopy={showToast} />
        </main>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}