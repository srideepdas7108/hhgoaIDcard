'use client';

import React, { useEffect, useRef, useState } from 'react';

type Role = {
  name: string;
  icon: string;
};

const ROLES: Role[] = [
  { name: 'AI Engineer', icon: '🤖' },
  { name: 'Full Stack Developer', icon: '💻' },
  { name: 'Product Designer', icon: '🎨' },
  { name: 'Founder', icon: '🚀' },
  { name: 'Data Scientist', icon: '📊' },
  { name: 'Student Builder', icon: '🌱' },
];

export default function Home() {
  const [mode, setMode] = useState<'id' | 'pfp'>('id');
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [dragging, setDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const builderId = 'HHG-717-1026';

  const hasRequiredData = Boolean(name.trim() && imageSrc);

  /*
   * -----------------------------
   * IMAGE UPLOAD
   * -----------------------------
   */

  const setImage = async (file: File) => {
    if (
      !file.type.startsWith('image/') &&
      !file.name.toLowerCase().endsWith('.heic')
    ) {
      return;
    }

    try {
      if (file.name.toLowerCase().endsWith('.heic')) {
        const heic2any = (await import('heic2any')).default;

        const converted = await heic2any({
          blob: file,
          toType: 'image/jpeg',
        });

        const blob = Array.isArray(converted)
          ? converted[0]
          : converted;

        setImageSrc(URL.createObjectURL(blob));
      } else {
        setImageSrc(URL.createObjectURL(file));
      }
    } catch {
      alert(
        'That image could not be read. Please try a JPG or PNG.'
      );
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      void setImage(file);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      void setImage(file);
    }
  };

  /*
   * -----------------------------
   * CANVAS HELPERS
   * -----------------------------
   */

  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = reject;

      img.src = src;
    });

  const roundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  };

  /*
   * -----------------------------
   * DRAW DOWNLOADABLE CARD
   * -----------------------------
   */

  const drawCanvas = async () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const w = 900;
    const h = 1350;

    canvas.width = w;
    canvas.height = h;

    ctx.clearRect(0, 0, w, h);

    /*
     * Background
     */

    ctx.fillStyle = '#fff3d9';
    ctx.fillRect(0, 0, w, h);

    /*
     * Card borders
     */

    ctx.strokeStyle = '#08764f';
    ctx.lineWidth = 12;

    ctx.strokeRect(
      28,
      28,
      w - 56,
      h - 56
    );

    ctx.strokeStyle = '#e3bb27';
    ctx.lineWidth = 4;

    ctx.strokeRect(
      45,
      45,
      w - 90,
      h - 90
    );

    /*
     * Hacker House logo
     */

    ctx.textAlign = 'center';

    ctx.fillStyle = '#075d3f';

    ctx.font =
      'bold 72px Georgia, serif';

    ctx.fillText(
      'HACKER',
      w / 2 - 115,
      150
    );

    ctx.fillStyle = '#e2b91f';

    ctx.font =
      'bold 55px Georgia, serif';

    ctx.fillText(
      'HOUSE',
      w / 2 + 155,
      150
    );

    ctx.fillStyle = '#df3f42';

    ctx.font =
      'bold 34px sans-serif';

    ctx.fillText(
      'गोवा',
      w / 2 + 22,
      143
    );

    /*
     * Palm trees
     */

    ctx.fillStyle = '#0a7650';

    ctx.font = '90px serif';

    ctx.textAlign = 'left';

    ctx.fillText(
      '🌴',
      60,
      250
    );

    ctx.textAlign = 'right';

    ctx.fillText(
      '🌴',
      840,
      250
    );

    /*
     * Photo circle
     */

    ctx.fillStyle = '#bfe9f5';

    ctx.beginPath();

    ctx.arc(
      450,
      485,
      195,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.strokeStyle = '#0a7650';

    ctx.lineWidth = 10;

    ctx.stroke();

    ctx.strokeStyle = '#e5bd22';

    ctx.lineWidth = 5;

    ctx.stroke();

    if (imageSrc) {
      try {
        const img = await loadImage(
          imageSrc
        );

        ctx.save();

        ctx.beginPath();

        ctx.arc(
          450,
          485,
          182,
          0,
          Math.PI * 2
        );

        ctx.clip();

        const aspect =
          img.width / img.height;

        let dw = 364;
        let dh = 364;

        if (aspect > 1) {
          dw = dh * aspect;
        } else {
          dh = dw / aspect;
        }

        ctx.drawImage(
          img,
          450 - dw / 2,
          485 - dh / 2,
          dw,
          dh
        );

        ctx.restore();
      } catch {
        // Keep placeholder.
      }
    } else {
      /*
       * Placeholder
       */

      ctx.fillStyle = '#d9f0f4';

      ctx.beginPath();

      ctx.arc(
        450,
        485,
        180,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = '#ffffff';

      ctx.beginPath();

      ctx.arc(
        505,
        415,
        55,
        0,
        Math.PI * 2
      );

      ctx.fill();

      ctx.fillStyle = '#8ebd55';

      ctx.beginPath();

      ctx.ellipse(
        450,
        550,
        180,
        55,
        0,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    /*
     * Green name pill
     */

    ctx.fillStyle = '#08764f';

    roundedRect(
      ctx,
      220,
      720,
      460,
      74,
      28
    );

    ctx.fill();

    ctx.fillStyle = '#fff3d9';

    ctx.font =
      'bold 32px monospace';

    ctx.textAlign = 'center';

    ctx.fillText(
      name || 'YOUR NAME',
      450,
      769
    );

    /*
     * Orange role pill
     */

    ctx.fillStyle = '#e44b2c';

    roundedRect(
      ctx,
      220,
      805,
      460,
      74,
      28
    );

    ctx.fill();

    ctx.fillStyle = '#fff3d9';

    ctx.font =
      'bold 27px monospace';

    ctx.fillText(
      role.name.toUpperCase(),
      450,
      854
    );

    /*
     * Team box
     */

    ctx.fillStyle = '#fff3d9';

    roundedRect(
      ctx,
      265,
      900,
      370,
      70,
      24
    );

    ctx.fill();

    ctx.strokeStyle = '#e1bd2b';

    ctx.lineWidth = 5;

    ctx.stroke();

    ctx.fillStyle = '#0a7650';

    ctx.font =
      '28px monospace';

    ctx.fillText(
      `✦ ${team || 'TEAM'} ✦`,
      450,
      946
    );

    /*
     * Metadata
     */

    ctx.fillStyle = '#0a7650';

    ctx.font =
      '20px monospace';

    ctx.textAlign = 'left';

    ctx.fillText(
      'BUILDER ID',
      110,
      1080
    );

    ctx.fillText(
      builderId,
      110,
      1115
    );

    ctx.fillText(
      '28.01–31.01.2026',
      110,
      1150
    );

    ctx.textAlign = 'right';

    ctx.fillText(
      'HOSTED BY',
      790,
      1080
    );

    ctx.fillStyle = '#0a7650';

    ctx.font =
      'bold 44px monospace';

    ctx.fillText(
      '2:47 PM',
      790,
      1135
    );

    ctx.font =
      'bold 26px monospace';

    ctx.fillText(
      'STUDIO',
      790,
      1170
    );

    /*
     * Footer
     */

    ctx.fillStyle = '#0a7650';

    roundedRect(
      ctx,
      300,
      1250,
      300,
      58,
      22
    );

    ctx.fill();

    ctx.fillStyle = '#e6c329';

    ctx.font =
      'bold 24px monospace';

    ctx.textAlign = 'center';

    ctx.fillText(
      '#FrameInGoa',
      450,
      1288
    );
  };

  /*
   * Redraw whenever data changes.
   */

  useEffect(() => {
    void drawCanvas();
  }, [
    name,
    team,
    role,
    imageSrc,
  ]);

  /*
   * -----------------------------
   * DOWNLOAD
   * -----------------------------
   */

  const handleDownload = () => {
    if (
      !hasRequiredData ||
      !canvasRef.current
    ) {
      return;
    }

    void drawCanvas().then(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) return;

      const link =
        document.createElement('a');

      link.download =
        `${name
          .trim()
          .replace(/\s+/g, '_')}_HH_Goa_ID.png`;

      link.href =
        canvas.toDataURL('image/png');

      link.click();
    });
  };

  /*
   * -----------------------------
   * SHARE ON X
   * -----------------------------
   */

  const handleShareToX = () => {
    const text =
      encodeURIComponent(
        `I'm building in Goa with Hacker House! 🌴\n\n#FrameInGoa`
      );

    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /*
   * -----------------------------
   * UI
   * -----------------------------
   */

  return (
    <main className="goa-page">

      {/* HEADER */}

      <header className="site-header">

        <div className="brand">
          HACKER
          <span>है</span>
          HOUSE
        </div>

        <div className="header-pills">

          <button type="button">
            Zero To One
          </button>

          <button type="button">
            #FrameInGoa
          </button>

        </div>

      </header>

      {/* MAIN */}

      <section className="builder-shell">

        {/* LEFT PANEL */}

        <div className="control-card">

          <div className="panel-heading">

            <div>
              <span className="eyebrow">
                CREATE
              </span>

              <h1>
                Your frame
              </h1>
            </div>

            <div className="mode-switch">

              <button
                type="button"
                className={
                  mode === 'id'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setMode('id')
                }
              >
                ID Card
              </button>

              <button
                type="button"
                className={
                  mode === 'pfp'
                    ? 'active'
                    : ''
                }
                onClick={() =>
                  setMode('pfp')
                }
              >
                PFP
              </button>

            </div>

          </div>

          <div className="form-body">

            {/* BUILDER ID */}

            <div className="builder-id">

              <span>
                BUILDER ID
              </span>

              <strong>
                {builderId}
              </strong>

            </div>

            {/* PHOTO */}

            <label className="field-label">
              PHOTO <b>*</b>
            </label>

            <button
              type="button"
              className={`upload-zone ${
                dragging
                  ? 'dragging'
                  : ''
              }`}
              onClick={() =>
                fileInputRef.current?.click()
              }
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() =>
                setDragging(false)
              }
              onDrop={handleDrop}
            >

              <span className="upload-icon">
                ↑
              </span>

              <span>

                <strong>
                  {imageSrc
                    ? 'Photo selected'
                    : 'Drop photo or tap to upload'}
                </strong>

                <small>
                  JPG · PNG · HEIC
                </small>

              </span>

            </button>

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/png,image/jpeg,image/heic,.heic"
              onChange={handleImageUpload}
            />

            {/* NAME / TEAM */}

            <div className="two-fields">

              <label>

                <span>
                  NAME <b>*</b>
                </span>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Your name"
                  maxLength={30}
                />

              </label>

              <label>

                <span>
                  TEAM

                  <em>
                    {team.length}/12
                  </em>
                </span>

                <input
                  value={team}
                  onChange={(e) =>
                    setTeam(
                      e.target.value.slice(
                        0,
                        12
                      )
                    )
                  }
                  placeholder="Milky Way"
                />

              </label>

            </div>

            {/* ROLE */}

            <div className="role-label">

              <span>
                ROLE <b>*</b>
              </span>

              <small>
                Auto sticker
              </small>

            </div>

            <div className="role-wrap">

              <button
                type="button"
                className="role-button"
                onClick={() =>
                  setShowRoles(
                    (value) => !value
                  )
                }
              >

                <span className="role-icon">
                  {role.icon}
                </span>

                <span>

                  <strong>
                    {role.name}
                  </strong>

                  <small>
                    Tap to change role
                  </small>

                </span>

                <span className="role-arrow">
                  ⌄
                </span>

              </button>

              {showRoles && (
                <div className="role-menu">

                  {ROLES.map((item) => (

                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setRole(item);
                        setShowRoles(false);
                      }}
                    >

                      <span>
                        {item.icon}
                      </span>

                      {item.name}

                    </button>

                  ))}

                </div>
              )}

            </div>

          </div>

          {/* ACTIONS */}

          <div className="panel-actions">

            <button
              type="button"
              disabled={!hasRequiredData}
              onClick={handleDownload}
            >
              Download
            </button>

            <button
              type="button"
              disabled={!hasRequiredData}
              onClick={handleShareToX}
            >
              Share on X
            </button>

          </div>

          <div className="hint">
            {hasRequiredData
              ? 'Your card is ready to download'
              : 'Upload a photo and enter your name'}
          </div>

        </div>

        {/* RIGHT PREVIEW */}

        <div className="preview-card">

          <div className="panel-heading preview-heading">

            <div>

              <span className="eyebrow">
                PREVIEW
              </span>

              <h2>
                {mode === 'id'
                  ? 'Builder ID'
                  : 'Builder PFP'}
              </h2>

            </div>

            <span className="template">
              Template
            </span>

          </div>

          <div className="preview-area">

            <div
              className={`id-card ${
                mode === 'pfp'
                  ? 'pfp-card'
                  : ''
              }`}
            >

              {/* CARD LOGO */}

              <div className="card-logo">
                HACKER
                <span>है</span>
                HOUSE
              </div>

              {/* PALMS */}

              <div className="card-palm palm-left">
                🌴
              </div>

              <div className="card-palm palm-right">
                🌴
              </div>

              {/* PHOTO */}

              <div className="card-photo">

                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt="Uploaded profile"
                  />
                ) : (
                  <div className="placeholder">

                    <span>
                      ☁
                    </span>

                    <i />

                  </div>
                )}

              </div>

              <div className="card-sun">
                ✦
              </div>

              {/* NAME */}

              <div className="card-pill green">
                {name || ' '}
              </div>

              {/* ROLE */}

              <div className="card-pill orange">
                {role.name}
              </div>

              {/* TEAM */}

              <div className="card-team">
                ✦ {team || ' '} ✦
              </div>

              {/* META */}

              <div className="card-meta">

                <span>
                  BUILDER ID
                  <br />

                  <b>
                    {builderId}
                  </b>

                  <br />

                  28.01–31.01.2026
                </span>

                <span className="host">

                  HOSTED BY
                  <br />

                  <b>
                    2:47 PM
                  </b>

                  <br />

                  STUDIO

                </span>

              </div>

              {/* FOOTER */}

              <div className="card-footer">
                #FrameInGoa
              </div>

            </div>

          </div>

          <div className="preview-hint">

            {imageSrc
              ? 'Live preview updates as you type'
              : 'Add a photo to personalize'}

          </div>

        </div>

      </section>

      {/* Hidden canvas used for download */}

      <canvas
        ref={canvasRef}
        className="download-canvas"
      />

    </main>
  );
}
