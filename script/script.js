// Navbar mobile toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  const toggleIcon = navToggle.querySelector("i");

  const closeMenu = () => {
    navLinks.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    if (toggleIcon) {
      toggleIcon.classList.remove("fa-xmark");
      toggleIcon.classList.add("fa-bars");
    }
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (toggleIcon) {
      toggleIcon.classList.toggle("fa-bars", !isOpen);
      toggleIcon.classList.toggle("fa-xmark", isOpen);
    }
  });

  // Chiudi il menu quando clicchi su un link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Chiudi con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });
}

// Effetto navbar on scroll (glow oro come il footer)
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Anno nel footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ANIMAZIONI SU SCROLL (IntersectionObserver)
const animatedEls = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window && animatedEls.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  animatedEls.forEach((el) => observer.observe(el));
} else {
  // fallback: se il browser non supporta IntersectionObserver
  animatedEls.forEach((el) => el.classList.add("is-visible"));
}

// LINK NAVBAR ATTIVO IN BASE ALLA SEZIONE
const sections = document.querySelectorAll("section[id]");
const navLinksAnchors = document.querySelectorAll(".nav-links a[href^='#']");

if (
  "IntersectionObserver" in window &&
  sections.length &&
  navLinksAnchors.length
) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinksAnchors.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      });
    },
    {
      /* zona “attiva” intorno al centro viewport */
      root: null,
      threshold: 0.4,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// BOTTONE TORNA SU
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// COOKIE BANNER
const cookieBanner = document.getElementById("cookie-banner");
const cookieAccept = document.getElementById("cookie-accept");

if (cookieBanner && cookieAccept) {
  const COOKIES_KEY = "dea_cleaning_cookies_accepted";

  if (localStorage.getItem(COOKIES_KEY) === "true") {
    cookieBanner.style.display = "none";
  }

  cookieAccept.addEventListener("click", () => {
    localStorage.setItem(COOKIES_KEY, "true");
    cookieBanner.style.display = "none";
  });
}
// ===========================
// CAROSELLO RECENSIONI
// ===========================
(function () {
  const carousel = document.querySelector(".reviews-carousel");
  if (!carousel) return;

  const track = carousel.querySelector(".reviews-track");
  const slides = Array.from(carousel.querySelectorAll(".review-card"));
  const prevBtn = carousel.querySelector(".reviews-prev");
  const nextBtn = carousel.querySelector(".reviews-next");
  const dotsContainer = carousel.querySelector(".reviews-dots");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 6000; // 6 secondi

  // Crea i pallini in base al numero di slide
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "reviews-dot";
    dot.dataset.index = String(index);
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.querySelectorAll(".reviews-dot"));

  function updateSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function goNext() {
    updateSlide(currentIndex + 1);
  }

  function goPrev() {
    updateSlide(currentIndex - 1);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(goNext, AUTOPLAY_DELAY);
  }

  function userNavigate(fn) {
    fn();
    startAutoplay(); // reset autoplay dopo interazione
  }

  // Eventi frecce
  if (nextBtn) {
    nextBtn.addEventListener("click", () => userNavigate(goNext));
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => userNavigate(goPrev));
  }

  // Eventi pallini
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.dataset.index || "0");
      userNavigate(() => updateSlide(idx));
    });
  });

  // Pausa autoplay su hover (desktop) / long press mobile non ci interessa
  carousel.addEventListener("mouseenter", () => {
    stopAutoplay();
  });
  carousel.addEventListener("mouseleave", () => {
    startAutoplay();
  });

  // Avvio
  updateSlide(0);
  startAutoplay();
})();
