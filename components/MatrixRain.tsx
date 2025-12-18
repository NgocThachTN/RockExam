import React, { useEffect, useRef } from 'react';

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const columns = Math.floor(width / 20);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;

    const chars = "0123456789ABCDEF"; // Hex for "code" feel

    const draw = () => {
      const isDark = document.documentElement.classList.contains('dark');
      
      // Fade out effect
      // Light mode: fade to sky-50 (approx #f0f9ff)
      // Dark mode: fade to zinc-950 (approx #09090b)
      if (isDark) {
          ctx.fillStyle = 'rgba(9, 9, 11, 0.1)'; 
      } else {
          ctx.fillStyle = 'rgba(240, 249, 255, 0.1)';
      }
      ctx.fillRect(0, 0, width, height);

      // Text color
      if (isDark) {
          ctx.fillStyle = '#f4f4f5'; // Zinc-100 to match dark mode text
      } else {
          ctx.fillStyle = '#18181b'; // Zinc-900 to match light mode text
      }
      
      ctx.font = '14px "JetBrains Mono", monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
    />
  );
};

export default MatrixRain;
