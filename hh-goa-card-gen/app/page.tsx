'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [name, setName] = useState('Alex Rivera');
  const [role, setRole] = useState('Full Stack Developer');
  const [builderTitle, setBuilderTitle] = useState('Goa Trailblazer');
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Convert uploaded image (including HEIC)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.toLowerCase().endsWith('.heic')) {
      const heic2any = (await import('heic2any')).default;
      const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg' });
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      setImageSrc(URL.createObjectURL(blob));
    } else {
      setImageSrc(URL.createObjectURL(file));
    }
  };

  // Render the badge directly onto the Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Card Dimensions (Event Badge aspect ratio)
    canvas.width = 600;
    canvas.height = 800;

    // 1. Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 800);
    bgGradient.addColorStop(0, '#0f172a');
    bgGradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 600, 800);

    // 2. Brand Accent Bar
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 0, 600, 12);

    // 3. Branding Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HH GOA 2026', 300, 65);

    ctx.fillStyle = '#f59e0b';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('BUILDER PASS', 300, 95);

    // 4. Draw Uploaded Photo Box (Auto-centered crop)
    const boxX = 150;
    const boxY = 130;
    const boxWidth = 300;
    const boxHeight = 300;

    ctx.fillStyle = '#334155';
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    if (imageSrc) {
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        const aspect = img.width / img.height;
        let dw = boxWidth;
        let dh = boxHeight;
        let dx = boxX;
        let dy = boxY;

        if (aspect > 1) {
          dh = boxHeight;
          dw = boxHeight * aspect;
          dx = boxX - (dw - boxWidth) / 2;
        } else {
          dw = boxWidth;
          dh = boxWidth / aspect;
          dy = boxY - (dh - boxHeight) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(boxX, boxY, boxWidth, boxHeight);
        ctx.clip();
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();

        // Border around photo
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        renderTextDetails(ctx);
      };
    } else {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('No Image Uploaded', 300, 280);
      renderTextDetails(ctx);
    }
  };

  const renderTextDetails = (ctx: CanvasRenderingContext2D) => {
    // 5. User Details
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name || 'Your Name', 300, 480);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '500 22px sans-serif';
    ctx.fillText(role || 'Role / Stack', 300, 520);

    // Title Tag Box
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.fillRect(150, 560, 300, 50);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(150, 560, 300, 50);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(builderTitle || 'Builder Title', 300, 592);

    // Footer Tagline
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('#FrameInGoa • HH Goa 2026', 300, 740);
  };

  useEffect(() => {
    drawCanvas();
  }, [name, role, builderTitle, imageSrc]);

  // Download Handler
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${name.replace(/\s+/g, '_')}_HH_Goa_Pass.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Share to X Handler
  const handleShareToX = () => {
    const tweetText = encodeURIComponent(
      `Excited to build at HH Goa 2026! Here is my official Builder Pass. 🚀\n\n#FrameInGoa`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-amber-500">HH Goa 2026 Badge Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl bg-slate-900 p-6 rounded-xl border border-slate-800">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Upload Profile Photo</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/heic"
              onChange={handleImageUpload}
              className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-amber-500 file:text-black font-semibold hover:file:bg-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Role / Stack</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Builder Title</label>
            <input
              type="text"
              value={builderTitle}
              onChange={(e) => setBuilderTitle(e.target.value)}
              className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded transition"
            >
              Download PNG
            </button>
            <button
              onClick={handleShareToX}
              className="flex-1 bg-sky-500 hover:bg-sky-400 text-black font-bold py-3 rounded transition"
            >
              Share to X
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="flex justify-center items-center">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[300px] sm:max-w-[350px] rounded-lg shadow-2xl border border-slate-800"
          />
        </div>
      </div>
    </main>
  );
}