/* ==========================================================
   HowToChinese — script
   1) Cambio lingua IT / EN
   2) Carosello della spreadsheet
   3) Voce di menu attiva durante lo scroll
   4) Fallback se una foto non esiste ancora
   ========================================================== */

/* ---------- 1) Lingua ---------- */
const I18N = {
  it: {
    lang_label: "Lingua",
    nav_sheet: "Spreadsheet", nav_sellers: "Sellers", nav_haul: "Haul", nav_coupon: "Coupon",
    hero_kicker: "La guida agli acquisti dalla Cina",
    hero_sub: "Spreadsheet, seller, haul e coupon in un unico posto, per scegliere con metodo.",
    idx_sheet: "I prodotti selezionati",
    idx_sellers: "I venditori migliori",
    idx_haul: "Gli ordini della community",
    idx_coupon: "Sconti e codici",
    scroll: "Scorri",
    sheet_lead: "Una tabella ordinata con link, prezzi e foto reali dei prodotti più richiesti della settimana.",
    sheet_cta: "Apri la spreadsheet",
    sellers_lead: "I venditori più affidabili, scelti per qualità, comunicazione e tempi di spedizione.",
    sellers_cta: "Entra nella sezione",
    haul_lead: "Ordini reali condivisi dalla community: cosa è arrivato, quanto è costato, come è andata.",
    haul_cta: "Scopri gli haul",
    coupon_lead: "Stiamo completando la sezione. A breve troverai codici sconto e promozioni aggiornate.",
    soon: "In arrivo",
    coupon_cta: "Apri i coupon",
    footer: "Sito indipendente, non affiliato a marketplace o venditori citati."
  },
  en: {
    lang_label: "Language",
    nav_sheet: "Spreadsheet", nav_sellers: "Sellers", nav_haul: "Haul", nav_coupon: "Coupon",
    hero_kicker: "Your guide to buying from China",
    hero_sub: "Spreadsheet, sellers, hauls and coupons in one place, so you can choose with a method.",
    idx_sheet: "Curated products",
    idx_sellers: "Top-rated sellers",
    idx_haul: "Community orders",
    idx_coupon: "Discounts and codes",
    scroll: "Scroll",
    sheet_lead: "A clean table with links, prices and real photos of this week's most requested products.",
    sheet_cta: "Open the spreadsheet",
    sellers_lead: "The most reliable sellers, picked for quality, communication and shipping times.",
    sellers_cta: "Enter the section",
    haul_lead: "Real orders shared by the community: what arrived, what it cost, how it went.",
    haul_cta: "Explore the hauls",
    coupon_lead: "We're finishing this section. Discount codes and fresh promotions are coming soon.",
    soon: "Coming soon",
    coupon_cta: "Open coupons",
    footer: "Independent site, not affiliated with any marketplace or seller mentioned."
  }
};

const langSelect = document.getElementById("lang-select");

function applyLang(lang) {
  const dict = I18N[lang] || I18N.it;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
}

let savedLang = "it";
try { savedLang = localStorage.getItem("htc-lang") || "it"; } catch (e) { /* storage non disponibile */ }
langSelect.value = savedLang;
applyLang(savedLang);

langSelect.addEventListener("change", () => {
  applyLang(langSelect.value);
  try { localStorage.setItem("htc-lang", langSelect.value); } catch (e) {}
});

/* ---------- 2) Carosello ---------- */
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const prev = carousel.querySelector('[data-dir="-1"]');
  const next = carousel.querySelector('[data-dir="1"]');

  const step = () => {
    const slide = track.querySelector(".slide");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return slide ? slide.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
  };

  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});

/* ---------- 3) Menu attivo ---------- */
const navLinks = document.querySelectorAll(".site-nav a");
const targets = [...navLinks]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  targets.forEach((t) => io.observe(t));
}

/* ---------- 4) Foto mancanti: resta visibile il segnaposto ---------- */
document.querySelectorAll(".slide-media img").forEach((img) => {
  img.addEventListener("error", () => img.remove());
});
