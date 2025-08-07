document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const langSwitcher = document.getElementById("lang-switcher");
  const body = document.body;

  // Tema ayarı
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
  });

  // Dil ayarı
  const translatePage = (lang) => {
    fetch(`./locales/${lang}.json`)
      .then((res) => res.json())
      .then((data) => {
        document.querySelector("#about h2").textContent = data.aboutTitle;
        document.querySelector("#about p").textContent = data.aboutText;

        document.querySelector("#experience h2").textContent = data.experienceTitle;
        const expItems = document.querySelectorAll("#experience ul li");
        expItems[0].innerHTML = `<strong>${data.exp1title}</strong> - ${data.exp1desc}`;
        expItems[1].innerHTML = `<strong>${data.exp2title}</strong> - ${data.exp2desc}`;
        expItems[2].innerHTML = `<strong>${data.exp3title}</strong> - ${data.exp3desc}`;

        document.querySelector("#projects h2").textContent = data.projectsTitle;
        document.getElementById("project1-desc").textContent = data.project1;
        document.getElementById("project2-desc").textContent = data.project2;
        document.getElementById("project3-desc").textContent = data.project3;
        document.getElementById("project4-desc").textContent = data.project4;

        document.querySelector("#contact h2").textContent = data.contactTitle;
        document.querySelector("#contact p").textContent = data.contactDesc;

        // Navbar
        const navLinks = document.querySelectorAll("nav a");
        navLinks[0].textContent = data.navAbout;
        navLinks[1].textContent = data.navExperience;
        navLinks[2].textContent = data.navProjects;
        navLinks[3].textContent = data.navContact;

        // Subtitle (header)
        document.querySelector(".subtitle").textContent = data.subtitle;
      })
      .catch((err) => {
        console.error("Translation load error:", err);
      });
  };

  const savedLang = localStorage.getItem("lang") || "en";
  langSwitcher.value = savedLang;
  translatePage(savedLang);

  langSwitcher.addEventListener("change", () => {
    const selectedLang = langSwitcher.value;
    localStorage.setItem("lang", selectedLang);
    translatePage(selectedLang);
  });
});
