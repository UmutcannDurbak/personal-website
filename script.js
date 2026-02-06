document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     1. THEME TOGGLES
     ========================================= */
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const savedTheme = localStorage.getItem("theme");

  // Apply saved theme or default to dark (no class needed as body is dark by default in CSS)
  if (savedTheme === "light") {
    body.classList.add("light-mode");
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    updateThemeIcon(isLight);
  });

  function updateThemeIcon(isLight) {
    // Simple SVG swap or logic if using icons
    // For now we just keep the same icon or could toggle between Sun/Moon if we had them
    // Let's assume the SVG in HTML is a Sun/Moon generic icon.
    // We can rotate it or change it:
    themeToggle.innerHTML = isLight
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>` // Moon
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`; // Sun
  }

  /* =========================================
     2. MOBILE MENU
     ========================================= */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    // Change icon from hamburger to X
    menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
  });

  // Close menu when clicking a link
  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.textContent = "☰";
    });
  });

  /* =========================================
     3. SCROLL ANIMATIONS (Intersection Observer)
     ========================================= */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Observe all sections and fade-in elements
  document.querySelectorAll("section, .fade-in, .fade-in-delay").forEach(el => {
    observer.observe(el);
  });

  /* =========================================
     4. MODAL LOGIC
     ========================================= */
  const modal = document.getElementById("project-modal");
  const modalBody = document.getElementById("modal-body");
  const closeModal = document.querySelector(".close-modal");

  document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3").innerText;
      const desc = card.querySelector("p").innerText;
      const link = card.getAttribute("data-link");

      let linkHtml = "";
      if (link && link !== "hidden") {
        linkHtml = `<a href="${link}" target="_blank" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">View Project</a>`;
      }

      modalBody.innerHTML = `
        <h2 style="margin-bottom: 15px; color: var(--primary);">${title}</h2>
        <p style="font-size: 1rem; line-height: 1.6;">${desc}</p>
        ${linkHtml}
      `;

      modal.style.display = "flex";
      // Small delay to allow display:flex to apply before opacity transition
      setTimeout(() => modal.classList.add("show"), 10);
    });
  });

  function hideModal() {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Match transition duration
  }

  closeModal.addEventListener("click", hideModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
  });

  /* =========================================
     5. LANGUAGE SWITCHER
     ========================================= */
  const langSwitcher = document.getElementById("lang-switcher");

  async function applyLanguage(lang) {
    try {
      const res = await fetch(`locales/${lang}.json`);
      const t = await res.json();

      // HEADER & HERO
      document.querySelector(".subtitle").textContent = t.subtitle;
      document.querySelector("#about h2").textContent = t.aboutTitle;
      document.querySelector("#about-text").textContent = t.aboutText;

      document.querySelector("#experience h2").textContent = t.experienceTitle;
      document.querySelector("#projects h2").textContent = t.projectsTitle;
      document.querySelector("#contact h2").textContent = t.contactTitle;
      document.querySelector("#contact p").innerText = t.contactDesc;

      // NAV
      const navLinks = document.querySelectorAll(".nav-links a");
      if (navLinks.length >= 4) {
        navLinks[0].textContent = t.navAbout;
        navLinks[1].textContent = t.navExperience;
        navLinks[2].textContent = t.navProjects;
        navLinks[3].textContent = t.navContact;
      }

      // TIMELINE ITEMS
      // Matching by Index (Fragile but currently necessary without IDs)
      const experienceItems = document.querySelectorAll("#experience .timeline-content");
      experienceItems.forEach((item, index) => {
        const keyTitle = `exp${index + 1}title`;
        const keyDesc = `exp${index + 1}desc`;

        if (t[keyTitle]) item.querySelector("h3").textContent = t[keyTitle];
        if (t[keyDesc]) item.querySelector("p").textContent = t[keyDesc];
      });

      // PROJECT ITEMS
      const projectItems = document.querySelectorAll("#projects .project-card");
      projectItems.forEach((item, index) => {
        const keyDesc = `project${index + 1}`;
        // Note: Project titles are not in JSON? 
        // Checking JSON... titles are NOT in JSON, only descriptions called "project1", "project2"...
        // This is a flaw in the JSON data, titles are hardcoded.
        // We will only update the description.
        if (t[keyDesc]) {
          item.querySelector("p").textContent = t[keyDesc];
        }
      });

    } catch (e) {
      console.error("Language load failed:", e);
    }
  }

  langSwitcher.addEventListener("change", (e) => {
    applyLanguage(e.target.value);
  });

  // Init
  applyLanguage(langSwitcher.value || "en");

});
