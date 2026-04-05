function initChart() {
  const canvas = document.getElementById('ohlcChart');
  if (!canvas) return;

  /* ── DATA ───────────────────────────────────────────────── */
  const actual = [
    { d: '20', o: 85061.54, h: 85302.30, l: 83954.54, c: 85167.14 },
    { d: '21', o: 85167.14, h: 88526.30, l: 85132.52, c: 87515.57 },
    { d: '22', o: 87515.57, h: 93937.07, l: 87084.84, c: 93483.30 },
    { d: '23', o: 93483.30, h: 94656.65, l: 91943.03, c: 93729.23 },
    { d: '24', o: 93729.23, h: 94047.54, l: 91693.21, c: 94022.48 },
    { d: '25', o: 94022.48, h: 95924.19, l: 92883.11, c: 94711.24 },
    { d: '26', o: 94711.24, h: 95258.03, l: 93916.48, c: 94663.66 },
    { d: '27', o: 94663.66, h: 95346.43, l: 93671.22, c: 93777.44 },
  ];

  const forecast = [
    { d: '20', o: 87330.76, h: 89080.67, l: 87002.39, c: 88668.69 },
    { d: '21', o: 88661.49, h: 90201.28, l: 88345.90, c: 89714.42 },
    { d: '22', o: 89695.54, h: 90951.09, l: 89372.54, c: 90458.64 },
    { d: '23', o: 90547.15, h: 91985.98, l: 89962.56, c: 91650.99 },
    { d: '24', o: 91641.49, h: 92715.87, l: 91130.36, c: 92303.73 },
    { d: '25', o: 92264.62, h: 93256.14, l: 91698.67, c: 92661.28 },
    { d: '26', o: 92706.72, h: 93216.67, l: 91991.91, c: 92815.62 },
    { d: '27', o: 92720.93, h: 93206.88, l: 92394.96, c: 92849.99 },
  ];

  /* ── DRAW ───────────────────────────────────────────────── */
  function draw() {
    const dpr   = window.devicePixelRatio || 1;
    const W     = canvas.parentElement.getBoundingClientRect().width;
    const H     = 220;

    canvas.width        = W * dpr;
    canvas.height       = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    /* colours */
    const dark      = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const textClr   = dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.26)';
    const gridClr   = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const actualClr   = '#1D9E75';
    const forecastClr = '#EF9F27';

    /* price range */
    const allPrices = [...actual, ...forecast].flatMap(d => [d.h, d.l]);
    const minP      = Math.min(...allPrices) - 900;
    const maxP      = Math.max(...allPrices) + 900;
    const rng       = maxP - minP;

    /* layout */
    const ml = 58, mr = 16, mt = 16, mb = 32;
    const cw = W - ml - mr;
    const ch = H - mt - mb;
    const n  = actual.length;
    const slotW  = cw / n;
    const halfW  = Math.max(3, Math.floor(slotW * 0.13));

    const py = p  => Math.round(mt + ch * (1 - (p - minP) / rng));
    const sx = i  => Math.round(ml + (i + 0.5) * slotW);

    /* grid + y-axis labels */
    const levels = 5;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= levels; i++) {
      const y = Math.round(mt + (ch / levels) * i) + 0.5;
      ctx.strokeStyle = gridClr;
      ctx.beginPath(); ctx.moveTo(ml, y); ctx.lineTo(W - mr, y); ctx.stroke();
      const price = maxP - (rng / levels) * i;
      ctx.fillStyle   = textClr;
      ctx.font        = '10px "DM Mono", monospace';
      ctx.textAlign   = 'right';
      ctx.fillText('$' + (price / 1000).toFixed(1) + 'K', ml - 5, y + 3);
    }

    /* candle drawing helper */
    function drawCandle(d, cx, w, bullClr, bearClr, alpha) {
      const isBull = d.c >= d.o;
      const clr    = isBull ? bullClr : bearClr;

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = clr;
      ctx.lineWidth   = 1;

      /* wick — snap to pixel center for crisp 1px line */
      const wx = Math.round(cx) + 0.5;
      ctx.beginPath();
      ctx.moveTo(wx, py(d.h));
      ctx.lineTo(wx, py(d.l));
      ctx.stroke();

      /* body — snap rect to pixel grid */
      const top    = py(Math.max(d.o, d.c));
      const bot    = py(Math.min(d.o, d.c));
      const bodyH  = Math.max(2, bot - top);
      const bx     = Math.round(cx - w);

      ctx.fillStyle = clr;
      ctx.fillRect(bx, top, w * 2, bodyH);
      ctx.globalAlpha = 1;
    }

    /* draw candles — actual first (behind), forecast on top */
    actual.forEach((d, i)   => drawCandle(d, sx(i), halfW, actualClr,   actualClr,   1));
    forecast.forEach((d, i) => drawCandle(d, sx(i), halfW, forecastClr, forecastClr, 0.80));

    /* x-axis date labels */
    ctx.fillStyle = textClr;
    ctx.font      = '10px "DM Mono", monospace';
    ctx.textAlign = 'center';
    actual.forEach((d, i) => ctx.fillText(d.d, sx(i), H - 10));
  }

  /* ── INIT & RESIZE ──────────────────────────────────────── */
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(draw, 80);
  });

  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', draw);
}