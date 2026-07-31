const menuButton = document.getElementById("menuButton");
const mainNav = document.getElementById("mainNav");
const siteHeader = document.querySelector(".site-header");
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    document.body.classList.toggle("menu-open", isOpen);

    const icon = menuButton.querySelector(".material-symbols-outlined");
    if (icon) {
      icon.textContent = isOpen ? "close" : "menu";
    }
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      document.body.classList.remove("menu-open");

      const icon = menuButton.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.textContent = "menu";
      }
    });
  });
}

window.addEventListener("scroll", () => {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 20);
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

if (contactForm && formNote) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formNote.textContent =
      "รับข้อมูลตัวอย่างเรียบร้อยแล้ว กรุณาเชื่อมต่อ Supabase หรือระบบอีเมลก่อนใช้งานจริง";
    formNote.classList.add("success");
  });
}
