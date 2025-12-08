const includePartials = async () => {
  const includes = document.querySelectorAll("[data-include]");
  const loaders = [...includes].map(async (el) => {
    const file = el.getAttribute("data-include");
    if (!file) return;
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`Failed to load ${file}`);
      const html = await res.text();
      el.innerHTML = html;
    } catch (error) {
      el.innerHTML = `<div class="alert">Unable to load component: ${file}</div>`;
      console.error(error);
    }
  });
  await Promise.all(loaders);
};

const initNavigation = () => {
  const nav = document.querySelector(".primary-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll(".has-dropdown").forEach((item) => {
    const trigger = item.querySelector(".dropdown-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      const expanded = item.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(expanded));
    });
  });
};

const renderList = (container, items, templateFn) => {
  if (!container || !items?.length) return;
  container.innerHTML = items.map(templateFn).join("");
};

const initHomePage = () => {
  if (!document.body.classList.contains("home-page")) return;
  const heroVerse = document.querySelector("[data-hero-verse]");
  const heroTranslation = document.querySelector("[data-hero-translation]");
  const heroText = document.querySelector("[data-hero-text]");
  const heroPrimary = document.querySelector("[data-hero-primary]");
  const heroSecondary = document.querySelector("[data-hero-secondary]");

  heroVerse.textContent = siteContent.hero.verse;
  heroTranslation.textContent = siteContent.hero.translation;
  heroText.textContent = siteContent.hero.subtext;
  heroPrimary.textContent = siteContent.hero.ctaPrimary.label;
  heroPrimary.href = siteContent.hero.ctaPrimary.link;
  // Hide secondary button
  if (heroSecondary) {
    heroSecondary.style.display = 'none';
  }

  const goalsList = document.querySelector("[data-goals]");
  const missionText = document.querySelector("[data-about-mission]");
  if (missionText) {
    missionText.textContent = siteContent.about.mission;
  }
  if (goalsList) {
    goalsList.innerHTML = siteContent.about.goals.map((goal) => `<li>${goal}</li>`).join("");
  }

  renderList(
    document.querySelector("#courses-grid"),
    siteContent.courses,
    (course) => `
      <article class="card">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p><strong>Level:</strong> ${course.level}</p>
      </article>
    `,
  );

  renderList(
    document.querySelector("#articles-preview"),
    siteContent.articles,
    (article) => `
      <article class="card article-card">
        <img src="${article.image}" alt="${article.title}">
        <span class="badge">${article.category}</span>
        <h3>${article.title}</h3>
        <p>${article.excerpt}</p>
        <p><small>${article.date} • ${article.author}</small></p>
        <a href="${article.link}" class="btn btn-outline">Read Article</a>
      </article>
    `,
  );
};

const initArticlesPage = () => {
  // Articles page is now handled by articles.js module
  // This function remains for backward compatibility but does nothing
  // The new articles.js will handle all article functionality
  if (document.getElementById('articles-grid') || document.getElementById('single-article')) {
    return; // Let articles.js handle it
  }
  
  // Fallback for old structure (if articles-list exists without articles-grid)
  const list = document.querySelector("#articles-list");
  if (list && typeof siteContent !== 'undefined' && siteContent.articles) {
    renderList(
      list,
      siteContent.articles,
      (article) => `
        <article class="card article-card">
          <img src="${article.image}" alt="${article.title}">
          <span class="badge">${article.category}</span>
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
          <p><small>${article.date} • ${article.author}</small></p>
          <a href="${article.link}" class="btn btn-outline">Read More</a>
        </article>
      `,
    );
  }
};

const initPricingPage = () => {
  renderList(
    document.querySelector("#pricing-grid"),
    siteContent.pricing,
    (plan) => `
      <article class="price-card">
        <h3>${plan.plan}</h3>
        <p>${plan.classes}</p>
        <div class="price">
          ${plan.originalUsd ? `<span class="original-price">${plan.originalUsd}</span>` : ''}
          <span class="discounted-price">${plan.usd}</span>
        </div>
        <div class="global-price">
          <span>
            ${plan.originalGbp ? `<span class="original-price">${plan.originalGbp}</span>` : ''}
            ${plan.gbp ? `<span class="discounted-price">${plan.gbp}</span>` : ''}
          </span>
          <span>/</span>
          <span>
            ${plan.originalEur ? `<span class="original-price">${plan.originalEur}</span>` : ''}
            ${plan.eur ? `<span class="discounted-price">${plan.eur}</span>` : ''}
          </span>
        </div>
        <ul>
          ${plan.perks.map((perk) => `<li>${perk}</li>`).join("")}
        </ul>
        <a class="btn btn-primary" href="/pages/contact.html">Enroll Now</a>
      </article>
    `,
  );
};


const initTermsPage = () => {
  const list = document.querySelector("#terms-list");
  if (!list) return;
  list.innerHTML = siteContent.terms.map((term) => `<li>${term}</li>`).join("");
};




const initContactForm = () => {
  const form = document.querySelector("form[data-contact]");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you! Our team will reach out within 24 hours.");
    form.reset();
  });
};

const initYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

const initPageScripts = () => {
  initNavigation();
  initHomePage();
  initArticlesPage();
  initPricingPage();
  initTermsPage();
  initContactForm();
  initYear();
};

document.addEventListener("DOMContentLoaded", async () => {
  await includePartials();
  initPageScripts();
});

