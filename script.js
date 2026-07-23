// 1. Add shadow to nav when user scrolls down
const navbar = document.getElementById("main-nav");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
}, { passive: true });


// 2. Mobile menu — open/close on hamburger click
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("active");
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Close menu when a nav link is clicked
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});


// 3. Custom cursor ring (desktop / mouse only)
const cursorRing = document.querySelector(".cursor");
const cursorDot  = document.querySelector(".cursor-dot");

if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = -100, mouseY = -100;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorRing.classList.add("visible");
    cursorDot.classList.add("visible");
  });

  // Move cursor elements every animation frame
  const moveCursor = () => {
    cursorRing.style.transform = `translate(${mouseX - 18}px, ${mouseY - 18}px)`;
    cursorDot.style.transform  = `translate(${mouseX - 2.5}px, ${mouseY - 2.5}px)`;
    requestAnimationFrame(moveCursor);
  };
  moveCursor();

  // Expand ring when hovering interactive elements
  document.querySelectorAll("a, button, .team-card, .match-row, .na-item").forEach(el => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("expanded"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("expanded"));
  });
}


// 4. Animate stat numbers counting up from 0 to their target
const countUp = (el, target) => {
  const t0 = performance.now();
  const tick = now => {
    const p    = Math.min((now - t0) / 1800, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    el.textContent = Math.floor(ease * target).toLocaleString("fr-FR");
    p < 1 ? requestAnimationFrame(tick) : (el.textContent = target.toLocaleString("fr-FR"));
  };
  requestAnimationFrame(tick);
};

// Trigger counter when the stats section enters the viewport
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    countUp(entry.target, parseInt(entry.target.dataset.count));
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.35 });

document.querySelectorAll(".bs-n[data-count]").forEach(el => counterObserver.observe(el));


// 5. Fade + slide elements in as they scroll into view
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      entry.target.style.opacity   = "1";
      entry.target.style.transform = "translateY(0)";
    }, entry.target.dataset.revealDelay || 0);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.06 });

document.querySelectorAll(
  ".team-card, .match-row, .na-item, .news-main, .sp-image, .sp-content, .bs-item, .manifesto-text"
).forEach((el, i) => {
  el.style.opacity    = "0";
  el.style.transform  = "translateY(28px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  el.dataset.revealDelay = (i % 4) * 90;
  revealObserver.observe(el);
});


// 6. Hero image moves slower than the page (parallax depth effect)
const heroImage = document.querySelector(".hero-visual img");
if (heroImage) {
  window.addEventListener("scroll", () => {
    heroImage.style.transform = `translateY(${window.scrollY * 0.18}px)`;
  }, { passive: true });
}
