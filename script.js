// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Header shadow on scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 2px 15px rgba(0,0,0,0.1)";
  } else {
    header.style.boxShadow = "none";
  }
});

// Mobile menu toggle
const mobileBtn = document.querySelector(".mobile-menu-btn");
const navMenu = document.querySelector(".nav-menu");

mobileBtn.addEventListener("click", () => {
  if (navMenu.style.display === "flex") {
    navMenu.style.display = "none";
  } else {
    navMenu.style.display = "flex";
    navMenu.style.flexDirection = "column";
  }
});
// Dark Mode Toggle
const darkModeBtn = document.querySelector('.icon-toggle[aria-label="Toggle Dark Mode"]');
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Setup based on local storage or system preference
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
    darkModeBtn.querySelector('.material-icons-round').textContent = 'light_mode';
}

darkModeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute("data-theme");
    let icon = darkModeBtn.querySelector('.material-icons-round');
    
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        icon.textContent = 'dark_mode';
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        icon.textContent = 'light_mode';
    }
});
