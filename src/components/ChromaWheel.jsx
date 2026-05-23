import { useRef, useCallback } from 'react';

export default function ChromaWheel({ hue, onHueChange, harmonyHues = [] }) {
  const svgRef = useRef(null);
  const dragging = useRef(false);

  const SIZE = 220;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUTER = 95;
  const R_INNER = 65;
  const R_MID = (R_OUTER + R_INNER) / 2;

  const getAngleFromMouse = useCallback((e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - CX;
    const y = e.clientY - rect.top - CY;
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return Math.round(angle) % 360;
  }, []);

  const handleMouseDown = (e) => {
    dragging.current = true;
    onHueChange(getAngleFromMouse(e));
  };

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    onHueChange(getAngleFromMouse(e));
  };

  const handleMouseUp = () => { dragging.current = false; };

  // Generate color ring segments
  const segments = [];
  for (let i = 0; i < 360; i += 1) {
    const a1 = ((i - 90) * Math.PI) / 180;
    const a2 = ((i + 1 - 90) * Math.PI) / 180;
    const x1o = CX + R_OUTER * Math.cos(a1);
    const y1o = CY + R_OUTER * Math.sin(a1);
    const x2o = CX + R_OUTER * Math.cos(a2);
    const y2o = CY + R_OUTER * Math.sin(a2);
    const x1i = CX + R_INNER * Math.cos(a2);
    const y1i = CY + R_INNER * Math.sin(a2);
    const x2i = CX + R_INNER * Math.cos(a1);
    const y2i = CY + R_INNER * Math.sin(a1);

    segments.push(
      <path
        key={i}
        d={`M${x1o},${y1o} A${R_OUTER},${R_OUTER} 0 0,1 ${x2o},${y2o} L${x1i},${y1i} A${R_INNER},${R_INNER} 0 0,0 ${x2i},${y2i} Z`}
        fill={`hsl(${i}, 85%, 55%)`}
      />
    );
  }

  // Marker position
  const markerAngle = ((hue - 90) * Math.PI) / 180;
  const mx = CX + R_MID * Math.cos(markerAngle);
  const my = CY + R_MID * Math.sin(markerAngle);

  return (
    <svg
      ref={svgRef}
      width={SIZE}
      height={SIZE}
      className="chroma-wheel"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {segments}

      {/* Harmony markers */}
      {harmonyHues.slice(1).map((h, i) => {
        const a = ((h - 90) * Math.PI) / 180;
        const hx = CX + R_MID * Math.cos(a);
        const hy = CY + R_MID * Math.sin(a);
        return (
          <g key={i}>
            <circle cx={hx} cy={hy} r="8" fill={`hsl(${h}, 85%, 55%)`} stroke="#fff3" strokeWidth="1.5"/>
          </g>
        );
      })}

      {/* Main marker */}
      <circle cx={mx} cy={my} r="12" fill={`hsl(${hue}, 85%, 55%)`} stroke="white" strokeWidth="2.5" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"/>
      <circle cx={mx} cy={my} r="5" fill="white"/>

      {/* Center display */}
      <circle cx={CX} cy={CY} r={R_INNER - 8} fill="var(--bg-secondary)" stroke="var(--border)" strokeWidth="1"/>
      <text x={CX} y={CY - 8} textAnchor="middle" fill="var(--text-primary)" fontSize="22" fontWeight="700">{hue}°</text>
      <text x={CX} y={CY + 12} textAnchor="middle" fill="var(--text-muted)" fontSize="10">HUE</text>
    </svg>
  );
}