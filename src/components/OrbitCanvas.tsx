import React, { useRef, useEffect } from 'react';

interface OrbitCanvasProps {
  altitudeKm: number;
  velocityMs: number;
  fuelPct: number;
  status: string;
}

export const OrbitCanvas: React.FC<OrbitCanvasProps> = ({ altitudeKm, velocityMs, fuelPct, status }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = Math.PI * 1.5;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) return;

      const cx = W / 2;
      const cy = H / 2;
      const orbitR = Math.min(W, H) * 0.36;
      const moonR = orbitR * 0.52;

      ctx.clearRect(0, 0, W, H);

      // Deep space background
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, W, H);

      // Starfield
      const stars = [
        [0.1, 0.2], [0.8, 0.15], [0.85, 0.7], [0.2, 0.8], [0.5, 0.05],
        [0.9, 0.3], [0.15, 0.5], [0.65, 0.85], [0.35, 0.25], [0.75, 0.95]
      ];
      ctx.fillStyle = 'rgba(200, 223, 245, 0.5)';
      stars.forEach(([sx, sy]) => {
        ctx.beginPath();
        ctx.arc(sx * W, sy * H, 1, 0, Math.PI * 2);
        ctx.fill();
      });

      // Moon Body
      const moonGrad = ctx.createRadialGradient(cx - moonR * 0.2, cy - moonR * 0.2, moonR * 0.1, cx, cy, moonR);
      moonGrad.addColorStop(0, '#4a5b6e');
      moonGrad.addColorStop(0.7, '#242e3b');
      moonGrad.addColorStop(1, '#0e141d');

      ctx.beginPath();
      ctx.arc(cx, cy, moonR, 0, Math.PI * 2);
      ctx.fillStyle = moonGrad;
      ctx.fill();

      // Craters
      const craters = [
        [0.25, 0.2, 9], [-0.3, -0.1, 14], [0.1, -0.3, 7],
        [-0.15, 0.35, 11], [0.35, -0.2, 8]
      ];
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.5;
      craters.forEach(([dx, dy, r]) => {
        ctx.beginPath();
        ctx.arc(cx + dx * moonR, cy + dy * moonR, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Moon Label
      ctx.fillStyle = 'rgba(200, 223, 245, 0.3)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('LUNE', cx, cy - 2);

      // Landing Zone (LZ-1) Marker at South Pole
      const lzAngle = Math.PI * 0.85;
      const lzDist = moonR * 0.85;
      const lzX = cx + Math.cos(lzAngle) * lzDist;
      const lzY = cy + Math.sin(lzAngle) * lzDist;

      ctx.beginPath();
      ctx.arc(lzX, lzY, 12, 0, Math.PI * 2);
      ctx.strokeStyle = '#22f59a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = 'rgba(34, 245, 154, 0.15)';
      ctx.fill();

      ctx.fillStyle = '#22f59a';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('LZ-1', lzX, lzY);

      // Orbit Path Ring
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(34, 212, 245, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Planned Descent Arc
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * orbitR, cy + Math.sin(angle) * orbitR);
      ctx.quadraticCurveTo(cx + Math.cos(angle + 0.5) * orbitR * 0.7, cy + Math.sin(angle + 0.5) * orbitR * 0.7, lzX, lzY);
      ctx.strokeStyle = 'rgba(245, 168, 34, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Module Movement
      angle += 0.005;
      const mx = cx + Math.cos(angle) * orbitR;
      const my = cy + Math.sin(angle) * orbitR;

      // Glow behind module
      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 20);
      glow.addColorStop(0, 'rgba(34, 212, 245, 0.4)');
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(mx, my, 20, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Asteria-3 Module Drawing
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(angle + Math.PI / 2);

      // Module shape
      ctx.fillStyle = '#c8dff5';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();

      // Solar Panels
      ctx.fillStyle = '#22d4f5';
      ctx.fillRect(-12, -2, 6, 4);
      ctx.fillRect(6, -2, 6, 4);

      ctx.restore();

      // Text Overlay
      ctx.fillStyle = '#22d4f5';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Asteria-3', mx + 12, my - 6);

      ctx.fillStyle = '#f5a822';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`Alt: ${altitudeKm.toFixed(1)}km`, mx + 12, my + 6);

      animId = requestAnimationFrame(render);
    };

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 260;
      }
    };

    resize();
    render();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [altitudeKm, velocityMs, fuelPct, status]);

  return (
    <div className="w-full h-full min-h-[220px] relative rounded-md overflow-hidden border border-[#0f1e30] bg-[#020408]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#060c14]/80 backdrop-blur border border-[#0f1e30] rounded text-[10px] font-mono text-[#4a7aaa]">
        Cible: Shackleton LZ-1 · V: {velocityMs.toFixed(0)} m/s
      </div>
    </div>
  );
};
