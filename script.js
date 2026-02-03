const nameEl = document.getElementById("name");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const playArea = document.getElementById("playArea");
const hint = document.getElementById("hint");
const success = document.getElementById("success");
const againBtn = document.getElementById("againBtn");
const shareBtn = document.getElementById("shareBtn");
const customMsg = document.getElementById("customMsg");
const loveLine = document.getElementById("loveLine");
const countdownText = document.getElementById("countdownText");

const chimeSound = document.getElementById("chimeSound");
const popSound = document.getElementById("popSound");
const sparkleSound = document.getElementById("sparkleSound");
if (sparkleSound) sparkleSound.volume = 0.25; // tiny & cute

// ---- Customize here ----
nameEl.textContent = "Mimi";
customMsg.textContent = "Prepare ur cake 🎂💘 I’ll put it in… gently 😌";
// -------------------------
// volume tuning
if (chimeSound) chimeSound.volume = 0.5;
if (popSound) popSound.volume = 0.35;

let dodgeCount = 0;
function updateCountdown() {
  // Valentine’s Day: Feb 14 (uses user’s device time)
  const now = new Date();
  const year = now.getFullYear();
  const valentine = new Date(year, 1, 14, 0, 0, 0); // month 1 = February

  // If past Feb 14 this year, count to next year
  if (now > valentine) {
    valentine.setFullYear(year + 1);
  }

  const diff = valentine - now;
  const totalSec = Math.max(0, Math.floor(diff / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  return { days, hours, mins, secs };
}

let countdownTimer = null;
function startCountdown() {
  if (!countdownText) return;

  const render = () => {
    const { days, hours, mins, secs } = updateCountdown();
    countdownText.textContent = `⏳ Valentine in ${days}d ${hours}h ${mins}m ${secs}s`;
  };

  render();
  clearInterval(countdownTimer);
  countdownTimer = setInterval(render, 1000);
}

function stopCountdown() {
  clearInterval(countdownTimer);
  countdownTimer = null;
  if (countdownText) countdownText.textContent = "";
}
function spawnSparkles(target, count = 7) {
  const rect = target.getBoundingClientRect();

  // YES scale from CSS var --s (default 1)
  const sVal = parseFloat(getComputedStyle(target).getPropertyValue("--s")) || 1;

  // 💗 make hearts bigger when YES is big
  // when yes goes 1 → 1.6, hearts size multiplier becomes ~1 → ~1.6
  const sizeMult = Math.min(1.8, 0.9 + sVal * 0.6);

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "sparkle";

    const v = document.createElement("span");
    v.className = "v";
    el.appendChild(v);

    // random pink shades
    const pinks = ["#ff4d86", "#ff6fa3", "#ff8fbf", "#ffc1d9", "#ff5c8a"];
    const color = pinks[Math.floor(Math.random() * pinks.length)];

    el.style.setProperty("--heartColor", color);
    el.style.setProperty("--drift", `${(Math.random() * 2 - 1) * 16}px`);

    // 💗 random heart size (scaled by sizeMult)
    const base = 10 + Math.random() * 8; // 10–18
    const final = base * sizeMult;
    el.style.width = `${final}px`;
    el.style.height = `${final}px`;

    // position above Yes button
    const x = rect.left + rect.width / 2 + (Math.random() * 56 - 28);
    const y = rect.top - 6 + (Math.random() * 14);

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }
}



// -------------------- NO button runs away --------------------
function moveNoButton() {
  const areaRect = playArea.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const pad = 8;
  const maxX = areaRect.width - btnRect.width - pad;
  const maxY = areaRect.height - btnRect.height - pad;

  const x = Math.max(pad, Math.floor(Math.random() * maxX));
  const y = Math.max(pad, Math.floor(Math.random() * maxY));

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.right = "auto";

  dodgeCount++;
  const lines = [
    "“No” seems a bit shy 😈",
    "Oops 😅 try again",
    "Come onnn 😭",
    "You can’t catch it 😏",
    "Just press Yes already 💖"
  ];
  hint.textContent = lines[Math.min(dodgeCount, lines.length - 1)];
    // ✅ yes button grows a bit each dodge
// ✅ yes button grows + cute jump
const scale = 1 + Math.min(dodgeCount * 0.08, 0.6);
yesBtn.style.setProperty("--s", scale);

// restart animation cleanly
yesBtn.classList.remove("jump");
void yesBtn.offsetWidth;
yesBtn.classList.add("jump");

// ✨ sparkles!
spawnSparkles(yesBtn, 7);
if (sparkleSound) {
  sparkleSound.currentTime = 0;
  sparkleSound.play().catch(() => {});
}


// restart animation cleanly
yesBtn.classList.remove("jump");
// force reflow so animation can replay
void yesBtn.offsetWidth;
yesBtn.classList.add("jump");


}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButton();
  },
  { passive: false }
);

// -------------------- HEART PARTICLES --------------------
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

let hearts = [];
let anim = null;

function drawHeart(x, y, size, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(size, size);

  ctx.beginPath();
  // heart path (simple)
  ctx.moveTo(0, -0.5);
  ctx.bezierCurveTo(0.5, -1.1, 1.4, -0.2, 0, 1.0);
  ctx.bezierCurveTo(-1.4, -0.2, -0.5, -1.1, 0, -0.5);
  ctx.closePath();

  ctx.fill();
  ctx.restore();
}

function launchHearts(durationMs = 2200) {
  hearts = Array.from({ length: 140 }, () => ({
    x: rand(0, window.innerWidth),
    y: rand(window.innerHeight + 20, window.innerHeight + 200),
    vy: rand(-3.2, -6.2),
    vx: rand(-1.2, 1.2),
    size: rand(6, 14),
    rot: rand(0, Math.PI * 2),
    vr: rand(-0.06, 0.06),
    alpha: rand(0.6, 1),
    // pink/red variations
    color: `hsla(${Math.floor(rand(330, 360))} 90% ${Math.floor(
      rand(55, 70)
    )}% , ${rand(0.65, 1)})`
  }));

  const start = performance.now();

  function frame(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    hearts.forEach((h) => {
      h.x += h.vx;
      h.y += h.vy;
      h.rot += h.vr;

      // slight "float" drag
      h.vy *= 0.995;
      h.vx *= 0.998;

      ctx.fillStyle = h.color;
      drawHeart(h.x, h.y, h.size / 18, h.rot);
    });

    hearts = hearts.filter((h) => h.y > -60);

    if (t - start < durationMs && hearts.length) {
      anim = requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      anim = null;
    }
  }

  if (anim) cancelAnimationFrame(anim);
  anim = requestAnimationFrame(frame);
}

// -------------------- VIBRATION --------------------
function vibrateNice() {
  // works on many Android devices; iOS often ignores vibrate from browser
  if ("vibrate" in navigator) {
    navigator.vibrate([60, 40, 60, 40, 120]);
  }
}

// -------------------- YES click behaviour --------------------
// -------------------- YES click behaviour --------------------
function showSuccess() {
  success.hidden = false;
  yesBtn.disabled = true;
  noBtn.disabled = true;
  hint.textContent = "Best choice ever 💘";

  vibrateNice();

    // 🔊 play sound
  yaySound.currentTime = 0;
  yaySound.play().catch(() => {});


  launchHearts();

  // 💖 love fade-in
  if (loveLine) {
    loveLine.classList.remove("show");
    setTimeout(() => loveLine.classList.add("show"), 250);
  }

  // ⏳ countdown starts showing
  startCountdown();
}

function reset() {
  success.hidden = true;
  yesBtn.disabled = false;
  noBtn.disabled = false;
  dodgeCount = 0;
  hint.textContent = "“No” seems a bit shy 😈";

  // stop sounds
  if (chimeSound) {
    chimeSound.pause();
    chimeSound.currentTime = 0;
  }
  if (popSound) {
    popSound.pause();
    popSound.currentTime = 0;
  }
  if (sparkleSound) {
    sparkleSound.pause();
    sparkleSound.currentTime = 0;
  }

  // reset NO position
  noBtn.style.left = "auto";
  noBtn.style.right = "22%";
  noBtn.style.top = "18px";

  // ✅ YES resets ONLY here (perfect)
  yesBtn.style.setProperty("--s", 1);
  yesBtn.classList.remove("jump");

  // hide love line again
  if (loveLine) loveLine.classList.remove("show");

  // stop countdown
  stopCountdown();
}

yesBtn.addEventListener("click", showSuccess);
againBtn.addEventListener("click", reset);

// -------------------- SHARE BUTTON --------------------
shareBtn.addEventListener("click", async () => {
  const text = `${nameEl.textContent} said YES! 💖\n${customMsg.textContent}`;

  // Web Share API (best on mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Valentine 💘",
        text,
        url: window.location.href
      });
      return;
    } catch (e) {
      // user cancelled; ignore
    }
  }

  // fallback: copy text + link
  try {
    await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    hint.textContent = "Copied! Now paste it in chat 💌";
  } catch {
    hint.textContent = "Copy this link and send it 💌";
  }
});

// keep no button okay on small screens
window.addEventListener("load", () => {
  const areaRect = playArea.getBoundingClientRect();
  if (areaRect.width < 360) noBtn.style.right = "10%";
});
