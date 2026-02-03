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
const secretHint = document.getElementById("secretHint");
const yaySound = document.getElementById("yaySound");
const copyBtn = document.getElementById("copyBtn");
const planBlock = document.getElementById("planBlock");
const planResult = document.getElementById("planResult");
const proposalOverlay = document.getElementById("proposalOverlay");
const openSecretBtn = document.getElementById("openSecretBtn");
const trapBtn = document.getElementById("trapBtn");

const closeOverlayBtn = document.getElementById("closeOverlayBtn");

const musicToggle = document.getElementById("musicToggle");
const bgMusic = document.getElementById("bgMusic");

const chimeSound = document.getElementById("chimeSound");
const popSound = document.getElementById("popSound");
const sparkleSound = document.getElementById("sparkleSound");
if (sparkleSound) sparkleSound.volume = 0.25; // tiny & cute
const secretLineText = "I choose you. Today, tomorrow, always 💖";
const questionBlock = document.getElementById("questionBlock");

const romanticLines = [
  "I choose you. Today, tomorrow, always 💖",
  "You’re my favorite person, forever and always ❤️",
  "Every day feels better with you in it 💕"
];

// simple rotation index stored in memory
let yesIndex = 0;

// ---- Customize here ----
nameEl.textContent = "Mimi";
customMsg.textContent = "";

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
let musicOn = false;
if (bgMusic) bgMusic.volume = 0.25;

musicToggle?.addEventListener("click", async () => {
  if (!bgMusic) return;

  try {
    if (!musicOn) {
      await bgMusic.play();
      musicOn = true;
      musicToggle.textContent = "Music: On 🎵";
    } else {
      bgMusic.pause();
      musicOn = false;
      musicToggle.textContent = "Music: Off 🎵";
    }
  } catch {
    // some browsers block until user interacts - clicking is interaction, so usually OK
  }
});
trapBtn?.addEventListener("click", () => {
  showProposal();
});

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


function showProposal() {
  if (!proposalOverlay) return;
  proposalOverlay.hidden = false;
}

function hideProposal() {
  if (!proposalOverlay) return;
  proposalOverlay.hidden = true;
}

closeOverlayBtn?.addEventListener("click", hideProposal);

// click outside the box closes it
proposalOverlay?.addEventListener("click", (e) => {
  if (e.target === proposalOverlay) hideProposal();
});

// ESC key closes it
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideProposal();
});

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
  // 😈 Funny: No gets tired
if (dodgeCount >= 10) {
  noBtn.textContent = "Ok fine 😭";
}
if (dodgeCount >= 12) {
  noBtn.style.display = "none"; // disappears 💀
}

// 💖 Compliments as YES grows
const compliments = [
  "Good choice 😏",
  "You’re adorable 😌",
  "That’s my girl 💖",
  "You know you want to 😈",
  "I’m smiling already 🥹"
];
hint.textContent = compliments[Math.min(dodgeCount, compliments.length - 1)];

  if (dodgeCount >= 10 && secretHint) {
  secretHint.hidden = false;
}

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

function typeText(el, text, speed = 28) {
  if (!el) return;
  el.textContent = "";
  let i = 0;

  // cancel any previous typing
  if (el._typingTimer) clearInterval(el._typingTimer);

  el._typingTimer = setInterval(() => {
    el.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(el._typingTimer);
      el._typingTimer = null;
    }
  }, speed);
}
function burstFromYes(count = 22) {
  const rect = yesBtn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  // reuse your hearts canvas (ctx, etc). If you already have a heart-particle system,
  // this will add extra burst hearts.
  for (let i = 0; i < count; i++) {
    hearts.push({
      x: originX + (Math.random() * 10 - 5),
      y: originY + (Math.random() * 10 - 5),
      vy: - (2.2 + Math.random() * 4.2),
      vx: (Math.random() * 4 - 2),
      size: 10 + Math.random() * 10,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() * 0.12 - 0.06),
      color: `hsla(${330 + Math.random() * 30} 90% ${55 + Math.random()*12}% , ${0.75 + Math.random()*0.25})`,
      drift: (Math.random() * 2 - 1) * 0.7,
      life: 0,
      maxLife: 120 + Math.random() * 40
    });
  }
}
function spawnBackgroundHeart() {
  hearts.push({
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 30,
    vy: -(0.6 + Math.random() * 1.2),
    vx: (Math.random() * 0.6 - 0.3),
    size: 6 + Math.random() * 8,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() * 0.03 - 0.015),
    color: `hsla(${330 + Math.random() * 30} 80% ${70 + Math.random()*10}% , ${0.25 + Math.random()*0.25})`,
    drift: (Math.random() * 2 - 1) * 0.25,
    life: 0,
    maxLife: 260 + Math.random() * 120
  });
}

copyBtn?.addEventListener("click", async () => {
  const text = `I said yes 💖\n${customMsg.textContent}\n${window.location.href}`;
  try {
    await navigator.clipboard.writeText(text);
    hint.textContent = "Copied 💌 Paste it to me 😏";
  } catch {
    hint.textContent = "Couldn’t copy 😭 (copy manually)";
  }
});
document.querySelectorAll(".planBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-plan");
    planResult.hidden = false;
    planResult.textContent = `Booked ✅ ${choice} with you, Mimi 💖`;
    // tiny extra hearts on selection
    burstFromYes(14);
  });
});
openSecretBtn?.addEventListener("click", () => {
  window.location.assign("./secret.html");
});
closeOverlayBtn?.addEventListener("click", () => {
  proposalOverlay.hidden = true;
});

// -------------------- YES click behaviour --------------------
function showSuccess() {
    if (questionBlock) {
  questionBlock.classList.add("fade-out");
  setTimeout(() => {
    questionBlock.style.display = "none";
  }, 520);
}
document.body.classList.remove("pulse");
void document.body.offsetWidth;
document.body.classList.add("pulse");

  success.hidden = false;
  yesBtn.disabled = true;
  noBtn.disabled = true;
  hint.textContent = "Best choice ever 💘";
  // 💌 rotate 2–3 lines each YES + typewriter effect
const line = romanticLines[yesIndex % romanticLines.length];
yesIndex++;
typeText(customMsg, line, 24);
    // ❤️‍🔥 pulse background
document.body.classList.remove("pulse");
void document.body.offsetWidth; // restart animation
document.body.classList.add("pulse");

  vibrateNice();

    // 🔊 play sound
  yaySound.currentTime = 0;
  yaySound.play().catch(() => {});









  // 💖 love fade-in
  if (loveLine) {
    loveLine.classList.remove("show");
    setTimeout(() => loveLine.classList.add("show"), 250);
  }

  // ⏳ countdown starts showing
  startCountdown();
  // 📍 proposal overlay after 5 seconds


// 🧾 store acceptance proof
const acceptedAt = new Date().toISOString();
localStorage.setItem("mimiAcceptedAt", acceptedAt);

}
function goSecret() {
  document.body.classList.add("fadeToBlack");
  setTimeout(() => {
    goSecret();;
  }, 450);
}

function reset() {
  success.hidden = true;
  yesBtn.disabled = false;
  noBtn.disabled = false;
  if (secretHint) secretHint.hidden = true;
  dodgeCount = 0;
  hint.textContent = "“No” seems a bit shy 😈";
if (questionBlock) {
  questionBlock.style.display = "";
  // force reflow so transition works next time
  void questionBlock.offsetWidth;
  questionBlock.classList.remove("fade-out");
}
// restore No button after tired/disappear
noBtn.style.display = "";
noBtn.textContent = "No";

// hide overlay
proposalOverlay.hidden = true;
proposalOverlay.style.display = "";

// reset plan
planResult.hidden = true;
planResult.textContent = "";

// optional: stop music on reset
// bgMusic?.pause(); musicOn=false; musicToggle.textContent="Music: Off 🎵";

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
yesIndex = 0;
if (customMsg) customMsg.textContent = "";
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
// hide proposal popup
hideProposal();

yesBtn.addEventListener("click", showSuccess);
againBtn.addEventListener("click", reset);

// -------------------- SHARE BUTTON --------------------
shareBtn.addEventListener("click", async () => {
  const text = `${nameEl.textContent} said YES! 💖\n${customMsg.textContent}`;

  // Web Share API (mobile best)
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Valentine 💘",
        text,
        url: window.location.href
      });

      // 😈 Secret page after successful share
      goSecret();;
      return;
    } catch (e) {
      // user cancelled share — do nothing
    }
  }

  // fallback: copy text + link, then go secret
  try {
    await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
    hint.textContent = "Copied! Now paste it in chat 💌";
  } catch {
    hint.textContent = "Copy this link and send it 💌";
  }

  // 😈 still go secret after fallback
  setTimeout(() => {
    goSecret();;
  }, 900);
});
setInterval(() => {
  // small amount = subtle
  spawnBackgroundHeart();
  if (Math.random() < 0.35) spawnBackgroundHeart();
}, 450);
// keep no button okay on small screens
window.addEventListener("load", () => {
  const areaRect = playArea.getBoundingClientRect();
  if (areaRect.width < 360) noBtn.style.right = "10%";
});
