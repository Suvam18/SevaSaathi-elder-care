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

// Mobile Sidebar Toggle
const mobileBtn = document.querySelector(".mobile-menu-btn");
const sidebarMenu = document.getElementById("sidebarMenu");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");

function openSidebar() {
    sidebarMenu.classList.add("open");
    sidebarOverlay.classList.add("open");
    document.body.style.overflow = 'hidden'; 
}

function closeSidebar() {
    sidebarMenu.classList.remove("open");
    sidebarOverlay.classList.remove("open");
    document.body.style.overflow = '';
}

if (mobileBtn) mobileBtn.addEventListener("click", openSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
if (sidebarOverlay) sidebarOverlay.addEventListener("click", closeSidebar);

// Feature Modal & Tab Logic
const featureModal = document.getElementById('featureModal');
const featureModalOverlay = document.getElementById('featureModalOverlay');
const closeModalBtn = document.getElementById('closeModalBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

function openModal(tabId) {
    // Close sidebar first if open
    closeSidebar();
    
    // Show modal
    featureModal.classList.add('open');
    featureModalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Activate specific tab
    activateTab(tabId);
}

function closeModal() {
    featureModal.classList.remove('open');
    featureModalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

function activateTab(tabId) {
    // Remove active class from all
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to target
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const targetPane = document.getElementById(`tab-${tabId}`);
    
    if (targetBtn && targetPane) {
        targetBtn.classList.add('active');
        targetPane.classList.add('active');
    }
}

// Tab button click handlers
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        activateTab(btn.getAttribute('data-tab'));
    });
});

// Modal close handlers
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (featureModalOverlay) featureModalOverlay.addEventListener('click', closeModal);

// Connect sidebar links to modal tabs
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Handle special modal links
        if (href === '#emergency') {
            e.preventDefault();
            e.stopPropagation(); // prevent other listeners from firing
            openModal('emergency');
        } else if (href === '#records') {
            e.preventDefault();
            e.stopPropagation(); // prevent other listeners from firing
            openModal('records');
        } else if (href === '#notifications') {
            e.preventDefault();
            e.stopPropagation(); // prevent other listeners from firing
            openModal('notifications');
        } else {
            // Normal link, just close sidebar
            closeSidebar();
        }
    });
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
// Scroll-triggered fade-in animation for feature cards
const fadeCards = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-bottom, .slide-in-right');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

fadeCards.forEach(card => {
    card.style.animationPlayState = 'paused';
    cardObserver.observe(card);
});

// Count-up animation for stat numbers
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const stepTime = 16;
    const totalSteps = Math.ceil(duration / stepTime);
    let step = 0;
    const timer = setInterval(() => {
        step++;
        const progress = step / totalSteps;
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString() + '+';
        if (step >= totalSteps) {
            el.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        }
    }, stepTime);
}

const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => statObserver.observe(num));

// Feature card click → open dedicated detail modal (single feature, no tabs)
const featureDetailOverlay = document.getElementById('featureDetailOverlay');
const featureDetailModal = document.getElementById('featureDetailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');
const fdmIcon = document.getElementById('fdmIcon');
const fdmTitle = document.getElementById('fdmTitle');

const featureDetailMeta = {
    'medication':   { icon: 'medication', title: 'Medication & Health' },
    'roadmap':      { icon: 'trending_up', title: 'Future Roadmap' },
    'key-features': { icon: 'grid_view', title: 'Key Features' },
    'family':       { icon: 'volunteer_activism', title: 'Family Sharing' },
    'privacy':      { icon: 'verified_user', title: 'Data Privacy' },
    'alerts':       { icon: 'notifications_active', title: 'Smart Alerts' },
    // New Feature Cards
    'health-logging': { icon: 'monitor_heart', title: 'Health Logging' },
    'care-sharing': { icon: 'folder_shared', title: 'Care Sharing' },
    'care-collaboration': { icon: 'handshake', title: 'Care Collaboration' },
    'medication-reminders': { icon: 'medication', title: 'Medication Reminders' },
    'emergency-sos': { icon: 'sos', title: 'Emergency SOS' },
    'appointment-tracking': { icon: 'calendar_month', title: 'Appointment Tracking' }
};

function openFeatureDetail(id) {
    // Hide all panes
    document.querySelectorAll('.fdm-pane').forEach(p => p.style.display = 'none');
    
    // Reset all panes to info view
    document.querySelectorAll('.fdm-view.info-view').forEach(v => v.classList.remove('hidden'));
    document.querySelectorAll('.fdm-view.form-view').forEach(v => v.classList.add('hidden'));

    // Show target pane
    const target = document.getElementById('fdm-' + id);
    if (target) target.style.display = 'block';
    
    // Update header
    const meta = featureDetailMeta[id] || {};
    if (fdmIcon) fdmIcon.textContent = meta.icon || 'info';
    if (fdmTitle) fdmTitle.textContent = meta.title || '';
    
    // Open modal
    featureDetailOverlay.classList.add('open');
    featureDetailModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeFeatureDetail() {
    featureDetailOverlay.classList.remove('open');
    featureDetailModal.classList.remove('open');
    document.body.style.overflow = '';
}

document.querySelectorAll('.feature-card-clickable').forEach(card => {
    card.addEventListener('click', () => {
        const tabId = card.getAttribute('data-feature-tab');
        openFeatureDetail(tabId);
    });
});

if (closeDetailModalBtn) closeDetailModalBtn.addEventListener('click', closeFeatureDetail);
if (featureDetailOverlay) featureDetailOverlay.addEventListener('click', closeFeatureDetail);

function toggleFdmView(featureId, viewType) {
    const infoView = document.getElementById('info-' + featureId);
    const formView = document.getElementById('form-' + featureId);
    
    if (viewType === 'form') {
        infoView.classList.add('hidden');
        formView.classList.remove('hidden');
    } else {
        infoView.classList.remove('hidden');
        formView.classList.add('hidden');
    }
}

function saveFdmData(featureId) {
    const formView = document.getElementById('form-' + featureId);
    const formContainer = formView.querySelector('.fdm-form-container');
    
    // Create success message
    const success = document.createElement('div');
    success.className = 'success-message';
    success.innerHTML = `<span class="material-icons-round">check_circle</span> Data saved successfully to ${featureDetailMeta[featureId].title}!`;
    
    // Append and then remove after delay
    formContainer.appendChild(success);
    
    setTimeout(() => {
        success.remove();
        toggleFdmView(featureId, 'info');
    }, 2000);
}

// Profile Dropdown Toggle
const profileIconBtn = document.querySelector('.profile-icon-btn');
const profileDropdown = document.querySelector('.profile-dropdown');

if (profileIconBtn && profileDropdown) {
    profileIconBtn.addEventListener('click', (e) => {
        e.preventDefault();
        profileDropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileIconBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('open');
        }
    });
}

