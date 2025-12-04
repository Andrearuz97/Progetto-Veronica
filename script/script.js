// ===========================
// NAVBAR MOBILE TOGGLE
// ===========================
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const htmlEl = document.documentElement; // ⬅️ aggiunto

if (navToggle && navLinks) {
  const toggleIcon = navToggle.querySelector("i");

  const lockBodyScroll = () => {
    // blocco scroll su HTML + BODY
    htmlEl.classList.add("nav-open");
    document.body.classList.add("nav-open");
  };

  const unlockBodyScroll = () => {
    htmlEl.classList.remove("nav-open");
    document.body.classList.remove("nav-open");
  };

  const closeMenu = () => {
    navLinks.classList.remove("show");
    navToggle.setAttribute("aria-expanded", "false");
    unlockBodyScroll();
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

    if (isOpen) {
      lockBodyScroll();   // blocco scroll, ma NON tocco posizione/scrollTo
    } else {
      unlockBodyScroll(); // sblocco, nessun salto
    }
  });

  // Chiudi il menu quando clicchi su un link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // CHIUSURA MENU CLICCANDO FUORI
  document.addEventListener("click", (e) => {
    const isMenuOpen = navLinks.classList.contains("show");
    if (!isMenuOpen) return;

    const clickedInsideMenu = navLinks.contains(e.target);
    const clickedToggle = navToggle.contains(e.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });



  // Chiudi con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const isMenuOpen = navLinks.classList.contains("show");
      if (isMenuOpen) {
        closeMenu();
      }
    }
  });
}



// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ===========================
// FOOTER YEAR
// ===========================
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ===========================
// ANIMAZIONI SU SCROLL
// ===========================
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
  animatedEls.forEach((el) => el.classList.add("is-visible"));
}

// ===========================
// LINK NAVBAR ATTIVO
// ===========================
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
      root: null,
      threshold: 0.4,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

// ===========================
// BOTTONE TORNA SU
// ===========================
const backToTop = document.getElementById("back-to-top");
if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });

  // Effetto tap/click visibile ovunque (anche Android)
  const addTapEffect = () => {
    backToTop.classList.add("tapped");
    setTimeout(() => {
      backToTop.classList.remove("tapped");
    }, 150);
  };

  backToTop.addEventListener("click", (e) => {
    e.preventDefault();
    addTapEffect();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    backToTop.blur();
  });
}

// ===========================
// COOKIE BANNER
// ===========================
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
  const originalSlides = Array.from(
    carousel.querySelectorAll(".review-card")
  );
  const prevBtn = carousel.querySelector(".reviews-prev");
  const nextBtn = carousel.querySelector(".reviews-next");
  const dotsContainer = carousel.querySelector(".reviews-dots");

  if (!track || originalSlides.length === 0) return;

  const slideCount = originalSlides.length;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 6000; // 6 secondi

  // ===========================
  // CLONI PER EFFETTO INFINITO
  // ===========================
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[slideCount - 1].cloneNode(true);

  // Struttura finale nel DOM:
  // [ lastClone, slide0, slide1, ..., slideN-1, firstClone ]
  track.insertBefore(lastClone, originalSlides[0]);
  track.appendChild(firstClone);

  const allSlides = Array.from(track.querySelectorAll(".review-card"));

  // Indice corrente nei "tutti i slide" (allSlides)
  // 0 = lastClone, 1 = slide reale 0, 2 = slide reale 1, ..., slideCount = slide reale N-1, slideCount+1 = firstClone
  let currentIndex = 1; // partiamo dalla PRIMA slide reale

  // ===========================
  // PALLINI (uno per ogni slide reale)
  // ===========================
  if (dotsContainer) {
    originalSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "reviews-dot";
      dot.dataset.index = String(index);
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer
    ? Array.from(dotsContainer.querySelectorAll(".reviews-dot"))
    : [];

  // Aggiorna posizione carosello + pallini
  function setPosition(animated = true) {
    if (!animated) {
      // disabilita momentaneamente la transition per "teletrasporti"
      track.style.transition = "none";
    }

    const offset = -currentIndex * 100; // ogni slide = 100%
    track.style.transform = `translateX(${offset}%)`;

    if (!animated) {
      // forza reflow
      void track.offsetWidth;
      // rimetti la transition come da CSS
      track.style.transition = "";
    }

    // indice reale per i pallini (0..slideCount-1)
    const realIndex = ((currentIndex - 1 + slideCount) % slideCount);

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === realIndex);
    });
  }

  function goNext() {
    currentIndex += 1;
    setPosition(true);
  }

  function goPrev() {
    currentIndex -= 1;
    setPosition(true);
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

  // ===========================
  // GESTIONE "FINE / INIZIO" (WRAP)
  // ===========================
  track.addEventListener("transitionend", () => {
    // Se siamo andati OLTRE l'ultima reale (sul clone della prima)
    if (currentIndex === slideCount + 1) {
      currentIndex = 1; // torna alla PRIMA reale
      setPosition(false); // senza animazione visibile
    }

    // Se siamo andati PRIMA della prima reale (sul clone dell'ultima)
    if (currentIndex === 0) {
      currentIndex = slideCount; // vai all'ULTIMA reale
      setPosition(false); // senza animazione visibile
    }
  });

  // ===========================
  // Eventi frecce (bottoni)
  // ===========================
  if (nextBtn) {
    nextBtn.addEventListener("click", () => userNavigate(goNext));
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", () => userNavigate(goPrev));
  }

  // ===========================
  // Eventi pallini
  // ===========================
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const realIndex = Number(dot.dataset.index || "0");
      userNavigate(() => {
        currentIndex = realIndex + 1; // +1 perché 0 è il clone dell'ultima
        setPosition(true);
      });
    });
  });

  // ===========================
  // SWIPE TOUCH (MOBILE)
  // ===========================
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouchSwiping = false;

  carousel.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isTouchSwiping = true;
  });

  carousel.addEventListener("touchmove", (e) => {
    if (!isTouchSwiping || !e.touches || e.touches.length === 0) return;

    const touch = e.touches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      e.preventDefault();

      if (dx < 0) {
        userNavigate(goNext);
      } else {
        userNavigate(goPrev);
      }

      isTouchSwiping = false;
    }
  });

  carousel.addEventListener("touchend", () => {
    isTouchSwiping = false;
  });

  // ===========================
  // DRAG CON MOUSE (DESKTOP)
  // ===========================
  let mouseStartX = 0;
  let isDragging = false;
  const DRAG_THRESHOLD = 40;

  const onMouseDown = (e) => {
    isDragging = true;
    mouseStartX = e.clientX;
    stopAutoplay();
  };

  const onMouseUp = (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - mouseStartX;

    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) goPrev();
      else goNext();
      startAutoplay();
    } else {
      startAutoplay();
    }
  };

  const onMouseLeave = () => {
    isDragging = false;
  };

  track.addEventListener("mousedown", onMouseDown);
  track.addEventListener("mouseup", onMouseUp);
  track.addEventListener("mouseleave", onMouseLeave);

  // ===========================
  // FRECCE TASTIERA (MENTRE SEI SOPRA IL CAROSELLO)
  // ===========================
  const handleKeydown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      userNavigate(goNext);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      userNavigate(goPrev);
    }
  };

  carousel.addEventListener("mouseenter", () => {
    window.addEventListener("keydown", handleKeydown);
    stopAutoplay();
  });

  carousel.addEventListener("mouseleave", () => {
    window.removeEventListener("keydown", handleKeydown);
    startAutoplay();
  });

  // Avvio iniziale
  setPosition(false); // vai alla prima reale senza animazione
  startAutoplay();
})();

