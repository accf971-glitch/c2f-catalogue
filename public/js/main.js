const FORMAT_LABELS = {
  presentiel: "Présentiel",
  distanciel: "Distanciel",
  mixte: "Mixte",
  elearning: "E-learning",
  alternance: "Alternance",
  stage: "Stage"
};

const state = {
  category: "",
  format: "",
  certifiante: "",
  cpf: "",
  lieu: "",
  q: ""
};

const categoryNav = document.getElementById("categoryNav");
const formationGrid = document.getElementById("formationGrid");
const emptyState = document.getElementById("emptyState");
const resultsTitle = document.getElementById("resultsTitle");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const filterFormat = document.getElementById("filterFormat");
const filterLieu = document.getElementById("filterLieu");
const resetFiltersBtn = document.getElementById("resetFilters");

let searchDebounce = null;

async function init() {
  const categories = await fetchJSON("/api/categories");
  renderCategoryNav(categories);

  const allFormations = await fetchJSON("/api/formations");
  populateLieuOptions(allFormations);

  await refreshResults();
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
  return res.json();
}

function renderCategoryNav(categories) {
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.name;
    btn.dataset.slug = cat.slug;
    btn.addEventListener("click", () => {
      state.category = cat.slug;
      setActiveCategoryButton(cat.slug);
      refreshResults();
    });
    categoryNav.appendChild(btn);
  });

  categoryNav.querySelector('button[data-slug=""]').addEventListener("click", () => {
    state.category = "";
    setActiveCategoryButton("");
    refreshResults();
  });
}

function setActiveCategoryButton(slug) {
  [...categoryNav.querySelectorAll("button")].forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.slug === slug);
  });
}

function populateLieuOptions(formations) {
  const lieux = [...new Set(formations.map((f) => f.lieu).filter(Boolean))].sort();
  lieux.forEach((lieu) => {
    const opt = document.createElement("option");
    opt.value = lieu;
    opt.textContent = lieu;
    filterLieu.appendChild(opt);
  });
}

function buildQueryString() {
  const params = new URLSearchParams();
  if (state.category) params.set("category", state.category);
  if (state.format) params.set("format", state.format);
  if (state.certifiante !== "") params.set("certifiante", state.certifiante);
  if (state.cpf !== "") params.set("cpf", state.cpf);
  if (state.lieu) params.set("lieu", state.lieu);
  if (state.q) params.set("q", state.q);
  return params.toString();
}

async function refreshResults() {
  const qs = buildQueryString();
  const formations = await fetchJSON(`/api/formations${qs ? `?${qs}` : ""}`);
  renderGrid(formations);
  updateResultsHeader(formations);
}

function updateResultsHeader(formations) {
  const activeBtn = categoryNav.querySelector("button.active");
  resultsTitle.textContent = activeBtn ? activeBtn.textContent : "Toutes les formations";
  resultsCount.textContent = `${formations.length} formation${formations.length > 1 ? "s" : ""}`;
}

function renderGrid(formations) {
  formationGrid.innerHTML = "";
  emptyState.style.display = formations.length === 0 ? "block" : "none";

  formations.forEach((f) => {
    const card = document.createElement("article");
    card.className = "formation-card";
    card.addEventListener("click", () => {
      window.location.href = `formation.html?id=${f.slug}`;
    });

    const duration = f.duration_days
      ? `${f.duration_hours}h (${f.duration_days} j)`
      : `${f.duration_hours}h`;

    card.innerHTML = `
      <span class="emoji">${f.image_emoji || "📘"}</span>
      <span class="category-tag">${escapeHtml(f.category_name)}</span>
      <h3>${escapeHtml(f.title)}</h3>
      <p class="summary">${escapeHtml(f.summary || "")}</p>
      <p class="price">${formatPrice(f.prix_ht)}</p>
      <div class="badge-row">
        <span class="badge">${FORMAT_LABELS[f.format] || f.format}</span>
        <span class="badge">${duration}</span>
        ${f.certifiante ? '<span class="badge success">Certifiante</span>' : ""}
        ${f.cpf_eligible ? '<span class="badge accent">Éligible CPF</span>' : ""}
        ${f.avis_count > 0 ? `<span class="badge accent">⭐ ${f.satisfaction_rate}%</span>` : ""}
      </div>
    `;

    formationGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatPrice(prixHt) {
  return prixHt != null
    ? `${new Intl.NumberFormat("fr-FR").format(prixHt)} € HT`
    : "Sur devis";
}

searchInput.addEventListener("input", (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.q = e.target.value.trim();
    refreshResults();
  }, 250);
});

filterFormat.addEventListener("change", (e) => {
  state.format = e.target.value;
  refreshResults();
});

filterLieu.addEventListener("change", (e) => {
  state.lieu = e.target.value;
  refreshResults();
});

document.querySelectorAll('input[name="certifiante"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    state.certifiante = e.target.value;
    refreshResults();
  });
});

document.querySelectorAll('input[name="cpf"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    state.cpf = e.target.value;
    refreshResults();
  });
});

resetFiltersBtn.addEventListener("click", () => {
  state.category = "";
  state.format = "";
  state.certifiante = "";
  state.cpf = "";
  state.lieu = "";
  state.q = "";

  searchInput.value = "";
  filterFormat.value = "";
  filterLieu.value = "";
  document.querySelector('input[name="certifiante"][value=""]').checked = true;
  document.querySelector('input[name="cpf"][value=""]').checked = true;
  setActiveCategoryButton("");

  refreshResults();
});

init().catch((err) => {
  console.error(err);
  formationGrid.innerHTML = `<p>Impossible de charger le catalogue. Vérifiez que le serveur est démarré.</p>`;
});
