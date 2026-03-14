const envelope = document.getElementById("envelope");
const replayBtn = document.getElementById("replay");
const wrapEl = document.querySelector(".wrap");

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

let W = 0, H = 0;
let confetti = [];
let animId = null;
let confettiRunning = false;

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  W = window.innerWidth;
  H = window.innerHeight;

  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function rand(min, max) { return Math.random() * (max - min) + min; }

function makeConfettiBurst(count = 160) {
  confetti = [];
  const palette = ["#ff6fb1", "#ff9bd1", "#ffd1e6", "#b983ff", "#8be9fd", "#fff1a8"];

  for (let i = 0; i < count; i++) {
    confetti.push({
      x: rand(W * 0.18, W * 0.82),
      y: rand(-40, H * 0.12),
      w: rand(6, 12),
      h: rand(8, 16),
      vx: rand(-2.8, 2.8),
      vy: rand(2.6, 6.4),
      rot: rand(0, Math.PI),
      vr: rand(-0.17, 0.17),
      life: rand(90, 160),
      color: palette[Math.floor(rand(0, palette.length))]
    });
  }
}

function stepConfetti() {
  ctx.clearRect(0, 0, W, H);

  let alive = 0;
  for (const p of confetti) {
    if (p.life <= 0) continue;
    alive++;

    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    p.vy += 0.035; // gravity
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  }

  if (alive > 0) {
    animId = requestAnimationFrame(stepConfetti);
  } else {
    stopConfetti();
  }
}

function launchConfetti() {
  if (confettiRunning) return;
  confettiRunning = true;
  makeConfettiBurst();
  stepConfetti();
}

function stopConfetti() {
  if (animId) cancelAnimationFrame(animId);
  animId = null;
  confettiRunning = false;
  confetti = [];
  ctx.clearRect(0, 0, W, H);
}

function openEnvelope() {
  envelope.classList.add("open");
  envelope.setAttribute("aria-expanded", "true");
  wrapEl.classList.add("open-sparkles");
  launchConfetti();
}

function resetEnvelope() {
  envelope.classList.remove("open");
  envelope.setAttribute("aria-expanded", "false");
  wrapEl.classList.remove("open-sparkles");
  stopConfetti();
}

envelope.addEventListener("click", () => {
  if (!envelope.classList.contains("open")) openEnvelope();
});

replayBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  resetEnvelope();
});
