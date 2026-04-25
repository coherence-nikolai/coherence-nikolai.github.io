const canvas = document.getElementById("tone-field");

document.addEventListener("click", (event) => {
  const target = event.target.closest(".lab-link[href], .support-grid a[href]");
  if (!target) {
    return;
  }

  const href = target.getAttribute("href");
  if (!href) {
    return;
  }

  event.preventDefault();
  window.location.href = href;
});

if (canvas) {
  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let frame = 0;

  function resize() {
    pixelRatio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function draw(time) {
    frame = reducedMotion ? 0 : time / 1000;
    context.clearRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.48;
    const radius = Math.min(width, height) * 0.24;

    const gradient = context.createRadialGradient(cx, cy, 0, cx, cy, radius * 2.4);
    gradient.addColorStop(0, "rgba(232, 215, 178, 0.16)");
    gradient.addColorStop(0.35, "rgba(232, 215, 178, 0.05)");
    gradient.addColorStop(1, "rgba(232, 215, 178, 0)");
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(cx, cy, radius * 2.4, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(242, 234, 223, 0.055)";
    context.lineWidth = 1;
    for (let index = 0; index < 4; index += 1) {
      context.beginPath();
      context.arc(cx, cy, radius * (1.35 + index * 0.58), 0, Math.PI * 2);
      context.stroke();
    }

    const amplitude = Math.min(88, height * 0.09);
    const yBase = height * 0.72 + Math.sin(frame * 0.28) * 7;
    const waveWidth = width * 1.18;
    const startX = -width * 0.09;

    context.lineCap = "round";
    context.lineJoin = "round";
    context.shadowBlur = 20;
    context.shadowColor = "rgba(232, 215, 178, 0.28)";

    for (let pass = 0; pass < 3; pass += 1) {
      context.beginPath();
      const alpha = pass === 0 ? 0.12 : pass === 1 ? 0.06 : 0.028;
      const lineWidth = pass === 0 ? 3 : pass === 1 ? 1.4 : 0.8;
      context.strokeStyle = `rgba(242, 234, 223, ${alpha})`;
      context.lineWidth = lineWidth;

      for (let x = 0; x <= waveWidth; x += 8) {
        const progress = x / waveWidth;
        const px = startX + x;
        const phase = progress * Math.PI * 2.2 + frame * 0.18 + pass * 0.12;
        const py = yBase + Math.sin(phase) * amplitude + Math.sin(phase * 0.5) * amplitude * 0.18;
        if (x === 0) {
          context.moveTo(px, py);
        } else {
          context.lineTo(px, py);
        }
      }
      context.stroke();
    }

    context.shadowBlur = 0;

    if (!reducedMotion) {
      window.requestAnimationFrame(draw);
    }
  }

  resize();
  window.addEventListener("resize", resize);
  window.requestAnimationFrame(draw);
}
