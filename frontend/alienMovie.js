const wraps = Array.from(document.querySelectorAll(".alien-wrap"));
const states = [];
let last = performance.now();

function rand(amount) {
  return (Math.random() * 2 - 1) * amount;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function initAlien(wrap) {
  const img = wrap.querySelector(".alien");
  const styles = img ? getComputedStyle(img) : null;
  const w = img ? parseFloat(styles.width) || 90 : 90;
  const h = img ? parseFloat(styles.height) || w : w;

  const speed = 180 + Math.random() * 1800;
  const angle = Math.random() * Math.PI * 2;
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  const x = Math.random() * Math.max(0, window.innerWidth - w);
  const y = Math.random() * Math.max(0, window.innerHeight - h);

  if (img) {
    img.style.setProperty("--spin-dur", `${1 + Math.random() * 1.4}s`);
    img.style.setProperty("--float-dur", `${0.7 + Math.random() * 0.9}s`);
  }

  return {
    wrap,
    img,
    x,
    y,
    vx,
    vy,
    w,
    h,
    nextJitter: performance.now() + 500 + Math.random() * 900,
  };
}

function tick(now) {
  const dt = (now - last) / 1000;
  last = now;

  states.forEach((s) => {
    s.x += s.vx * dt;
    s.y += s.vy * dt;

    const maxX = Math.max(0, window.innerWidth - s.w);
    const maxY = Math.max(0, window.innerHeight - s.h);

    if (s.x <= 0) {
      s.x = 0;
      s.vx = Math.abs(s.vx) + rand(60);
    }
    if (s.x >= maxX) {
      s.x = maxX;
      s.vx = -Math.abs(s.vx) + rand(60);
    }
    if (s.y <= 0) {
      s.y = 0;
      s.vy = Math.abs(s.vy) + rand(60);
    }
    if (s.y >= maxY) {
      s.y = maxY;
      s.vy = -Math.abs(s.vy) + rand(60);
    }

    if (now >= s.nextJitter) {
      s.vx = clamp(s.vx + rand(140), -320, 320);
      s.vy = clamp(s.vy + rand(140), -320, 320);
      s.nextJitter = now + 600 + Math.random() * 900;
    }

    s.wrap.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
  });

  requestAnimationFrame(tick);
}

function refreshSizes() {
  states.forEach((s) => {
    if (!s.img) return;
    const styles = getComputedStyle(s.img);
    s.w = parseFloat(styles.width) || s.w || 90;
    s.h = parseFloat(styles.height) || s.h || s.w || 90;
  });
}

wraps.forEach((wrap) => states.push(initAlien(wrap)));
refreshSizes();
window.addEventListener("resize", refreshSizes);
requestAnimationFrame(tick);
