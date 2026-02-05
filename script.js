// Background glow particles
const bgCanvas = document.getElementById("background-glow");
if (bgCanvas) {
  const ctx = bgCanvas.getContext("2d");
  let particles = [];
  let width = window.innerWidth;
  let height = window.innerHeight;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    bgCanvas.width = width;
    bgCanvas.height = height;
  };

  resize();
  window.addEventListener("resize", resize);

  const createParticles = () => {
    particles = [];
    const count = Math.min(60, Math.floor((width * height) / 25000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 30 + Math.random() * 60,
        alpha: 0.05 + Math.random() * 0.12,
        speedX: (Math.random() - 0.5) * 0.1,
        speedY: (Math.random() - 0.5) * 0.1,
      });
    }
  };

  createParticles();
  window.addEventListener("resize", createParticles);

  const render = () => {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -100) p.x = width + 100;
      if (p.x > width + 100) p.x = -100;
      if (p.y < -100) p.y = height + 100;
      if (p.y > height + 100) p.y = -100;

      const gradient = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        p.radius
      );
      gradient.addColorStop(0, `rgba(255, 159, 197, ${p.alpha})`);
      gradient.addColorStop(0.5, `rgba(182, 146, 255, ${p.alpha * 0.8})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  };

  render();
}

// Music control
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const bgMusic = document.getElementById("bg-music");
let isPlaying = false;

if (musicToggle && bgMusic && musicIcon) {
  const updateIcon = () => {
    musicIcon.textContent = isPlaying ? "⏸" : "▶";
  };

  musicToggle.addEventListener("click", async () => {
    if (!isPlaying) {
      try {
        await bgMusic.play();
        isPlaying = true;
      } catch (err) {
        console.warn("Autoplay blocked:", err);
      }
    } else {
      bgMusic.pause();
      isPlaying = false;
    }
    updateIcon();
  });

  bgMusic.addEventListener("ended", () => {
    isPlaying = false;
    updateIcon();
  });
}

// Typewriter message
const typewriterEl = document.getElementById("typewriter");
const cursorEl = document.getElementById("typewriter-cursor");
const longMessage = `
Another year older — and we're lucky to have you in our class! From boring lectures to fun breaks, you make the whole vibe better.

You're the one who makes group projects less painful, the laugh that gets everyone in the mood, and the friend we can always count on in class. Thanks for being such a cool classmate.

I couldn't say all of this in person, so I made you this little corner of the internet — a small reminder that you're valued and that we're glad you're part of our batch.

May this year bring you good grades, great memories, lots of fun with friends, and everything you're working for. Here's to more classes together, more laughs, and more awesome moments.

Thanks for being an amazing classmate and a real one. We're glad you're in our squad. I’d hug forever if time allowed.

Happy birthday! Have an awesome year ahead. 🎂
`.trim();

let typeIndex = 0;
let typeIntervalId;

function startTypewriter() {
  if (!typewriterEl) return;
  if (typeIntervalId) return;

  // Gently start music when the heartfelt message begins (if not already playing)
  if (bgMusic && !isPlaying) {
    bgMusic
      .play()
      .then(() => {
        isPlaying = true;
        if (musicIcon) {
          musicIcon.textContent = "⏸";
        }
      })
      .catch(() => {
        // Autoplay might be blocked; it's okay, user can press play manually.
      });
  }

  const speed = 28;
  typeIntervalId = setInterval(() => {
    if (typeIndex >= longMessage.length) {
      clearInterval(typeIntervalId);
      typeIntervalId = null;
      if (cursorEl) cursorEl.style.display = "none";
      return;
    }

    const currentChar = longMessage[typeIndex];
    typewriterEl.textContent += currentChar;
    typeIndex += 1;
  }, speed);
}

// Scroll reveal
const revealElements = document.querySelectorAll(
  ".reveal-up, .reveal-fade, .reveal-left, .reveal-right"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");

          if (
            entry.target.closest("#message") &&
            !typeIntervalId &&
            typeIndex === 0
          ) {
            startTypewriter();
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("revealed"));
  startTypewriter();
}

// Confetti
const confettiCanvas = document.getElementById("confetti-canvas");
const surpriseButton = document.getElementById("surprise-button");
const surpriseMessage = document.getElementById("surprise-message");

if (confettiCanvas && surpriseButton && surpriseMessage) {
  const cctx = confettiCanvas.getContext("2d");
  let cw, ch;
  let confettiPieces = [];
  let confettiActive = false;

  const resizeConfetti = () => {
    cw = window.innerWidth;
    ch = window.innerHeight;
    confettiCanvas.width = cw;
    confettiCanvas.height = ch;
  };

  resizeConfetti();
  window.addEventListener("resize", resizeConfetti);

  const createConfetti = () => {
    confettiPieces = [];
    const count = 220;
    const colors = [
      "#ff9ac1",
      "#f0a9ff",
      "#ffcba4",
      "#e6d4ff",
      "#ffffff",
    ];

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: Math.random() * cw,
        y: Math.random() * -ch,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: 2 + Math.random() * 4,
        speedX: (Math.random() - 0.5) * 1.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
  };

  const drawConfetti = () => {
    cctx.clearRect(0, 0, cw, ch);
    confettiPieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > ch + 20) {
        p.y = -20;
        p.x = Math.random() * cw;
      }

      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rotation);
      cctx.fillStyle = p.color;
      cctx.globalAlpha = 0.85;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    });
  };

  const loop = () => {
    if (!confettiActive) return;
    drawConfetti();
    requestAnimationFrame(loop);
  };

  const triggerConfetti = () => {
    createConfetti();
    confettiActive = true;
    loop();
    setTimeout(() => {
      confettiActive = false;
      cctx.clearRect(0, 0, cw, ch);
    }, 3500);
  };

  surpriseButton.addEventListener("click", () => {
    triggerConfetti();
    surpriseMessage.classList.add("visible");
  });
}

