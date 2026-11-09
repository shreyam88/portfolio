/**
 * Shreyam Rajpoot - Frontend Developer Portfolio
 * Features: Three.js Particles, GSAP ScrollTrigger, Custom Magnetic Cursor,
 * Dynamic Typing, Interactive Terminal, 3D Tilt Cards, Theme Accent Switcher,
 * Project Modals, and Confetti Form Submission.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. MOBILE MENU & HEADER SCROLL
  // ==========================================================================
  const mainHeader = document.getElementById("mainHeader");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-item");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
      }
    });
  }

  // Header background on scroll & Reading Progress Bar
  const scrollProgressBar = document.getElementById("scrollProgress");
  const backToTopBtn = document.getElementById("backToTop");
  const progressCircle = document.querySelector(".progress-ring-circle");
  const circleRadius = 20;
  const circleCircumference = 2 * Math.PI * circleRadius;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
    progressCircle.style.strokeDashoffset = circleCircumference;
  }

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Header blur effect
    if (scrollY > 50) {
      mainHeader.classList.add("scrolled");
    } else {
      mainHeader.classList.remove("scrolled");
    }

    // Progress bar
    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Back to top button visibility & progress ring
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add("show");
        if (progressCircle) {
          const offset = circleCircumference - (scrollPercent / 100) * circleCircumference;
          progressCircle.style.strokeDashoffset = offset;
        }
      } else {
        backToTopBtn.classList.remove("show");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==========================================================================
  // 2. ACTIVE NAVBAR LINK SCROLLSPY
  // ==========================================================================
  const sections = document.querySelectorAll("section[id]");

  function scrollSpy() {
    const scrollY = window.pageYOffset + 150;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", scrollSpy);

  // ==========================================================================
  // 3. THEME ACCENT SWITCHER
  // ==========================================================================
  const themeBtn = document.getElementById("themeBtn");
  const themeSwitcher = document.querySelector(".theme-switcher");
  const paletteOptions = document.querySelectorAll(".palette-option");

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem("shreyam_theme") || "cyan";
  document.body.setAttribute("data-theme", savedTheme);

  paletteOptions.forEach(opt => {
    if (opt.getAttribute("data-color") === savedTheme) {
      opt.classList.add("active");
    } else {
      opt.classList.remove("active");
    }
  });

  if (themeBtn && themeSwitcher) {
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeSwitcher.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!themeSwitcher.contains(e.target)) {
        themeSwitcher.classList.remove("open");
      }
    });

    paletteOptions.forEach(option => {
      option.addEventListener("click", () => {
        const selectedColor = option.getAttribute("data-color");
        document.body.setAttribute("data-theme", selectedColor);
        localStorage.setItem("shreyam_theme", selectedColor);

        paletteOptions.forEach(p => p.classList.remove("active"));
        option.classList.add("active");
        themeSwitcher.classList.remove("open");

        showToast(`Theme switched to ${selectedColor.toUpperCase()}!`);
      });
    });
  }

  // ==========================================================================
  // 4. DYNAMIC TYPING EFFECT
  // ==========================================================================
  const titles = [
    "Responsive React.js Interfaces",
    "Reusable UI Components",
    "REST API Integrations",
    "JavaScript Web Applications",
    "Full-Stack MERN Projects"
  ];

  let titleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typingEl = document.querySelector(".typing");

  const TYPING_SPEED = 100;
  const DELETING_SPEED = 50;
  const PAUSE_END = 1600;
  const PAUSE_START = 400;

  function runTypingEffect() {
    if (!typingEl) return;

    const currentTitle = titles[titleIdx];

    if (!isDeleting) {
      typingEl.textContent = currentTitle.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentTitle.length) {
        isDeleting = true;
        setTimeout(runTypingEffect, PAUSE_END);
        return;
      }
    } else {
      typingEl.textContent = currentTitle.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        titleIdx = (titleIdx + 1) % titles.length;
        setTimeout(runTypingEffect, PAUSE_START);
        return;
      }
    }

    setTimeout(runTypingEffect, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  runTypingEffect();

  // ==========================================================================
  // 5. CUSTOM DUAL MAGNETIC CURSOR (Desktop only)
  // ==========================================================================
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (cursorDot && cursorRing && window.matchMedia("(hover: hover)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth lerp follow for ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover expanders
    const interactiveElements = document.querySelectorAll(
      "a, button, .card, .skill-card, .project-card, .copyable-card, .terminal-tab, .cert-card"
    );

    interactiveElements.forEach(el => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });
  }

  // ==========================================================================
  // 6. THREE.JS INTERACTIVE 3D AI SCIFI UNIVERSE
  // ==========================================================================
  const canvas = document.getElementById("bgCanvas");
  if (canvas && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 24;

    // 1. Organic Starfield Constellation
    const particleCount = window.innerWidth < 768 ? 600 : 1400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f2fe);
    const magentaColor = new THREE.Color(0xff007f);
    const blueColor = new THREE.Color(0x3b82f6);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 75;
      positions[i + 1] = (Math.random() - 0.5) * 75;
      positions[i + 2] = (Math.random() - 0.5) * 60;

      const mixedColor = Math.random() > 0.6 ? magentaColor : (Math.random() > 0.3 ? cyanColor : blueColor);
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, particleMaterial);
    scene.add(particleSystem);

    // 2. 3D AI Cyber Holographic Core (Wireframe Icosahedron & Gyroscope Rings)
    const cyberGroup = new THREE.Group();

    // Outer Wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(window.innerWidth < 768 ? 4.5 : 6.2, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    cyberGroup.add(icoMesh);

    // Inner Glowing Particle Sphere
    const innerGeo = new THREE.SphereGeometry(window.innerWidth < 768 ? 2.2 : 3.2, 18, 18);
    const innerMat = new THREE.PointsMaterial({
      color: 0xff007f,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const innerPoints = new THREE.Points(innerGeo, innerMat);
    cyberGroup.add(innerPoints);

    // Gyroscope Outer Ring 1
    const ringGeo1 = new THREE.TorusGeometry(window.innerWidth < 768 ? 6.5 : 9.5, 0.05, 16, 90);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    cyberGroup.add(ringMesh1);

    // Gyroscope Outer Ring 2
    const ringGeo2 = new THREE.TorusGeometry(window.innerWidth < 768 ? 5.2 : 7.8, 0.04, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.35,
      wireframe: true
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    cyberGroup.add(ringMesh2);

    // Position Cyber Core: floating on the right side behind the hero on desktop
    const setCyberPosition = () => {
      if (window.innerWidth >= 1024) {
        cyberGroup.position.set(9.5, 0.5, -4);
      } else {
        cyberGroup.position.set(0, 0, -8);
      }
    };
    setCyberPosition();
    scene.add(cyberGroup);

    // Mouse Parallax Physics
    let targetX = 0;
    let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener("mousemove", (event) => {
      targetX = (event.clientX - windowHalfX) * 0.0008;
      targetY = (event.clientY - windowHalfY) * 0.0008;
    });

    // Window Resize Handler
    window.addEventListener("resize", () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setCyberPosition();
    });

    // Animation Loop with 3D Rotation & Scroll Depth
    const clock = new THREE.Clock();
    function animateThree() {
      requestAnimationFrame(animateThree);
      const elapsedTime = clock.getElapsedTime();

      // Continuous 3D rotation of the starfield
      particleSystem.rotation.y = elapsedTime * 0.02 + targetX * 1.5;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.08 + targetY * 1.5;

      // Dynamic 3D rotation of the Cyber Gyroscope
      cyberGroup.rotation.x = elapsedTime * 0.12 + targetY * 2;
      cyberGroup.rotation.y = elapsedTime * 0.18 + targetX * 2;
      ringMesh1.rotation.z = elapsedTime * 0.3;
      ringMesh2.rotation.z = -elapsedTime * 0.25;

      // Subtle levitation
      cyberGroup.position.y = (window.innerWidth >= 1024 ? 0.5 : 0) + Math.sin(elapsedTime * 0.9) * 0.8;

      // Scroll reactive camera depth
      const scrollY = window.scrollY;
      camera.position.z = 24 + scrollY * 0.008;
      camera.position.x += (targetX * 18 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 18 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
    animateThree();
  }

  // ==========================================================================
  // 6.5 HERO PHOTO 3D SPATIAL PARALLAX TILT
  // ==========================================================================
  const heroCard = document.getElementById("heroPhotoCard");
  const heroWrapper = document.querySelector(".hero-photo-wrapper");
  const photoGlare = document.querySelector(".photo-glare");

  if (heroCard && heroWrapper && window.matchMedia("(hover: hover)").matches) {
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    heroWrapper.addEventListener("mousemove", (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Angle calculation (-18deg to +18deg)
      targetRotX = ((y - centerY) / centerY) * -18;
      targetRotY = ((x - centerX) / centerX) * 18;

      // Move specular glare with light reflection
      if (photoGlare) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        photoGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`;
      }
    });

    heroWrapper.addEventListener("mouseleave", () => {
      targetRotX = 0;
      targetRotY = 0;
      if (photoGlare) {
        photoGlare.style.background = `radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`;
      }
    });

    function updateHero3D() {
      // Smooth lerp interpolation
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;

      heroCard.style.transform = `perspective(1200px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
      requestAnimationFrame(updateHero3D);
    }
    updateHero3D();
  }

  // ==========================================================================
  // 7. STATS COUNTER ANIMATION
  // ==========================================================================
  const statNumbers = document.querySelectorAll(".stat-number");
  let statsCounted = false;

  function countUpStats() {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute("data-target"));
      const isDecimal = target % 1 !== 0;
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutExpo
        const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = easeVal * target;

        if (isDecimal) {
          stat.textContent = currentVal.toFixed(1);
        } else {
          stat.textContent = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = isDecimal ? target.toFixed(1) : String(target);
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  const statsSection = document.querySelector(".stats-banner");
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsCounted) {
        countUpStats();
        statsCounted = true;
      }
    }, { threshold: 0.4 });

    statsObserver.observe(statsSection);
  }

  // ==========================================================================
  // 8. INTERACTIVE DEVELOPER TERMINAL TABS
  // ==========================================================================
  const terminalTabs = document.querySelectorAll(".terminal-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");

  terminalTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const tabTarget = tab.getAttribute("data-tab");

      terminalTabs.forEach(t => t.classList.remove("active"));
      tabPanes.forEach(pane => pane.classList.remove("active"));

      tab.classList.add("active");
      const activePane = document.getElementById(`pane-${tabTarget}`);
      if (activePane) {
        activePane.classList.add("active");
      }
    });
  });

  // ==========================================================================
  // 9. SKILLS CATEGORY FILTER
  // ==========================================================================
  const skillFilterBtns = document.querySelectorAll(".skill-filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  skillFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      skillFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");

      skillCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterVal === "all" || category === filterVal) {
          card.style.display = "flex";
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // ==========================================================================
  // 10. PROJECTS FILTER & 3D TILT EFFECT
  // ==========================================================================
  const projectFilterBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  projectFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      projectFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const cat = card.getAttribute("data-category");
        if (filter === "all" || cat.includes(filter)) {
          card.style.display = "block";
          card.style.opacity = "1";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Enhanced 3D Card Hover Perspective Tilt with Dynamic Glare
  projectCards.forEach(card => {
    const cardInner = card.querySelector(".project-card-inner");
    if (!cardInner) return;

    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return; // Skip on mobile
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      cardInner.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
      cardInner.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(26, 42, 78, 0.9) 0%, rgba(14, 22, 42, 0.75) 70%)`;
    });

    card.addEventListener("mouseleave", () => {
      cardInner.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      cardInner.style.background = "";
    });
  });

  // ==========================================================================
  // 11. PROJECT DETAILS MODAL
  // ==========================================================================
  const modalBackdrop = document.getElementById("projectModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalContent = document.getElementById("modalContent");
  const detailButtons = document.querySelectorAll(".view-details-btn");

  const projectDetails = {
    ebook: {
      title: "E-Book Store",
      tag: "React (Vite) • Node.js • Express.js • MongoDB",
      description: "A full-stack e-book marketplace with browsing, search, category filtering, ratings, and reviews.",
      metrics: "Includes JWT authentication, role-based access, Razorpay test-mode payments, and a purchaser-only library for protected PDF downloads.",
      features: [
        "Browse and search books, filter by category, and view ratings and reviews.",
        "Authenticate users with JWT and restrict actions with role-based access control.",
        "Process payments using Razorpay in test mode.",
        "Protect PDF downloads so only purchasers can access their library.",
        "Manage books and upload PDFs and cover images from an admin dashboard using Multer.",
        "Secure REST APIs with Helmet and express-rate-limit."
      ],
      github: "https://github.com/shreyam88"
    },
    invoice: {
      title: "Invoice Generator",
      tag: "React • JavaScript • jsPDF",
      description: "A React application for creating invoices with itemized products and configurable quantities and prices.",
      metrics: "Supports tax rates and discounts, and exports downloadable invoice PDFs with jsPDF.",
      features: [
        "Add and itemize products with configurable quantities and pricing.",
        "Apply tax rates and discounts to invoice data.",
        "Export generated invoices as downloadable PDFs using jsPDF.",
        "Use reusable UI components and form-based interactions."
      ],
      github: "https://github.com/shreyam88"
    },
    ats: {
      title: "Resume ATS Tracker",
      tag: "Python • Gemini Pro API",
      description: "A Python-based tool that analyzes resumes against job descriptions using the Gemini Pro API.",
      metrics: "Generates resume scores and highlights ATS-compliance and keyword gaps to improve resume-job alignment.",
      features: [
        "Evaluate a resume against a provided job description.",
        "Generate an ATS-oriented resume score.",
        "Identify keyword gaps and ATS-compliance issues.",
        "Use Gemini Pro API for resume analysis."
      ],
      github: "https://github.com/shreyam88"
    }
  };

  detailButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const projId = btn.getAttribute("data-project");
      const data = projectDetails[projId];

      if (data && modalContent) {
        modalContent.innerHTML = `
          <div class="modal-project-header">
            <span class="modal-project-badge">${data.tag}</span>
            <h3 class="modal-project-title">${data.title}</h3>
          </div>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem;">${data.description}</p>
          <div style="background: rgba(0, 242, 254, 0.08); border: 1px solid var(--border-glow); padding: 10px 16px; border-radius: 8px; margin-bottom: 1.2rem; font-size: 0.9rem; color: var(--primary);">
            <i class="fa-solid fa-circle-info"></i> <b>Project details:</b> ${data.metrics}
          </div>
          <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #fff;">Project Features:</h4>
          <ul class="modal-feature-list">
            ${data.features.map(f => `<li>${f}</li>`).join("")}
          </ul>
          <div style="margin-top: 1.8rem; display: flex; gap: 12px;">
            <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1; justify-content: center;">
              <i class="fa-brands fa-github"></i> GitHub Profile
            </a>
            <a href="#contact" onclick="document.getElementById('projectModal').classList.remove('open');" class="btn btn-secondary" style="flex: 1; justify-content: center;">
              <i class="fa-solid fa-envelope"></i> Discuss Project
            </a>
          </div>
        `;
        modalBackdrop.classList.add("open");
        document.body.style.overflow = "hidden";
      }
    });
  });

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ==========================================================================
  // 12. COPY TO CLIPBOARD CARDS & TOAST NOTIFICATION
  // ==========================================================================
  const toast = document.getElementById("toastNotification");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    const msgEl = toast.querySelector(".toast-message");
    if (msgEl) msgEl.textContent = message;

    toast.classList.add("show");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  const copyableCards = document.querySelectorAll(".copyable-card");
  copyableCards.forEach(card => {
    card.addEventListener("click", () => {
      const textToCopy = card.getAttribute("data-copy");
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          showToast("Copied to clipboard!");
        });
      }
    });
  });

  // ==========================================================================
  // 13. INTERACTIVE CONTACT FORM WITH CONFETTI
  // ==========================================================================
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const subjectInput = document.getElementById("subject");
      const messageInput = document.getElementById("message");

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.closest(".form-group").classList.add("error");
        isValid = false;
      } else {
        nameInput.closest(".form-group").classList.remove("error");
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.closest(".form-group").classList.add("error");
        isValid = false;
      } else {
        emailInput.closest(".form-group").classList.remove("error");
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectInput.closest(".form-group").classList.add("error");
        isValid = false;
      } else {
        subjectInput.closest(".form-group").classList.remove("error");
      }

      // Validate Message
      if (messageInput.value.trim().length < 10) {
        messageInput.closest(".form-group").classList.add("error");
        isValid = false;
      } else {
        messageInput.closest(".form-group").classList.remove("error");
      }

      if (!isValid) return;

      // Trigger Submit State
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending Message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';

        // Fire celebration confetti if loaded
        if (typeof confetti === "function") {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.7 }
          });
        }

        formStatus.className = "form-status success";
        formStatus.textContent = "Thank you! Your message has been sent successfully. I will get back to you shortly.";
        showToast("Message received! Thank you for reaching out.");

        // Fallback mailto trigger so the message actually reaches the user
        const mailtoSubject = encodeURIComponent(subjectInput.value);
        const mailtoBody = encodeURIComponent(`From: ${nameInput.value} (${emailInput.value})\n\n${messageInput.value}`);
        window.open(`mailto:shreyam8859@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`, "_blank");

        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHTML;
          formStatus.style.display = "none";
        }, 5000);
      }, 1000);
    });

    // Remove error class on input
    contactForm.querySelectorAll("input, textarea").forEach(input => {
      input.addEventListener("input", () => {
        input.closest(".form-group").classList.remove("error");
      });
    });
  }

  // ==========================================================================
  // 14. GSAP SCROLL ENTRANCE ANIMATIONS
  // ==========================================================================
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Stagger In
    gsap.from(".hero-text > *", {
      opacity: 0,
      y: 30,
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out"
    });

    gsap.from(".hero-photo-card", {
      opacity: 0,
      scale: 0.85,
      duration: 1.2,
      ease: "back.out(1.7)",
      delay: 0.3
    });

    // Sections Reveal
    gsap.utils.toArray("section").forEach(sec => {
      if (sec.id === "home") return;

      gsap.from(sec.querySelector(".section-header"), {
        scrollTrigger: {
          trigger: sec,
          start: "top 85%"
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power2.out"
      });
    });

    // Skills Card Stagger
    gsap.from(".skill-card", {
      scrollTrigger: {
        trigger: ".skills-grid",
        start: "top 80%"
      },
      opacity: 0,
      y: 30,
      stagger: 0.05,
      duration: 0.6,
      ease: "power2.out"
    });

    // Timeline Items Stagger
    gsap.from(".timeline-item", {
      scrollTrigger: {
        trigger: ".journey-container",
        start: "top 80%"
      },
      opacity: 0,
      x: -30,
      stagger: 0.2,
      duration: 0.8,
      ease: "power2.out"
    });

    // Project Cards Reveal
    gsap.from(".project-card", {
      scrollTrigger: {
        trigger: ".project-grid",
        start: "top 80%"
      },
      opacity: 0,
      y: 40,
      stagger: 0.18,
      duration: 0.8,
      ease: "power2.out"
    });
  }
});
