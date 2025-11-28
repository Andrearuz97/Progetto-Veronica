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

// Anno nel footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Effetto navbar on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (!header) return;

  if (window.scrollY > 10) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

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
