const FORMAT_LABELS = {
  presentiel: "Présentiel",
  distanciel: "Distanciel",
  mixte: "Mixte",
  elearning: "E-learning",
  alternance: "Alternance",
  stage: "Stage"
};

const params = new URLSearchParams(window.location.search);
const formationId = params.get("id");

const detailEl = document.getElementById("formationDetail");
const modal = document.getElementById("contactModal");
const closeModalBtn = document.getElementById("closeModal");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const modalFormationTitle = document.getElementById("modalFormationTitle");

let currentFormation = null;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

async function loadFormation() {
  if (!formationId) {
    detailEl.innerHTML = `<p>Formation introuvable.</p>`;
    return;
  }

  const res = await fetch(`/api/formations/${encodeURIComponent(formationId)}`);
  if (!res.ok) {
    detailEl.innerHTML = `<p>Cette formation n'existe pas ou n'est plus disponible.</p>`;
    return;
  }

  currentFormation = await res.json();
  render(currentFormation);
}

function render(f) {
  document.title = `${f.title} - C2F`;

  const duration = f.duration_days
    ? `${f.duration_hours} h (${f.duration_days} jour${f.duration_days > 1 ? "s" : ""})`
    : `${f.duration_hours} h`;

  detailEl.innerHTML = `
    <div class="detail-main">
      <span class="emoji-lg">${f.image_emoji || "📘"}</span>
      <div class="category-tag">${escapeHtml(f.category_name)}</div>
      <h1>${escapeHtml(f.title)}</h1>
      <p>${escapeHtml(f.summary || "")}</p>

      <div class="badge-row">
        <span class="badge">${FORMAT_LABELS[f.format] || f.format}</span>
        <span class="badge">${duration}</span>
        ${f.certifiante ? '<span class="badge success">Certifiante</span>' : ""}
        ${f.cpf_eligible ? '<span class="badge accent">Éligible CPF</span>' : ""}
        ${f.accessible ? '<span class="badge">Accessible</span>' : ""}
      </div>

      ${section("Public visé", f.public_vise)}
      ${section("Prérequis", f.prerequis)}
      ${section("Objectifs", f.objectifs)}
      ${section("Programme", f.programme)}
    </div>

    <aside class="sidebar-card">
      <div class="info-row"><span>Format</span><span>${FORMAT_LABELS[f.format] || f.format}</span></div>
      <div class="info-row"><span>Durée</span><span>${duration}</span></div>
      <div class="info-row"><span>Lieu</span><span>${escapeHtml(f.lieu || "-")}</span></div>
      <div class="info-row"><span>Certifiante</span><span>${f.certifiante ? "Oui" : "Non"}</span></div>
      <div class="info-row"><span>Éligible CPF</span><span>${f.cpf_eligible ? "Oui" : "Non"}</span></div>
      <button class="cta-button" id="openContact">Demander des informations</button>
    </aside>
  `;

  document.getElementById("openContact").addEventListener("click", openModal);
}

function section(title, content) {
  if (!content) return "";
  return `
    <div class="detail-section">
      <h2>${title}</h2>
      <p>${escapeHtml(content)}</p>
    </div>
  `;
}

function openModal() {
  modalFormationTitle.textContent = currentFormation ? currentFormation.title : "";
  formStatus.textContent = "";
  formStatus.className = "form-status";
  contactForm.reset();
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    formation_id: currentFormation ? currentFormation.id : null,
    nom: document.getElementById("nom").value.trim(),
    email: document.getElementById("email").value.trim(),
    telephone: document.getElementById("telephone").value.trim(),
    message: document.getElementById("message").value.trim()
  };

  formStatus.textContent = "Envoi en cours...";
  formStatus.className = "form-status";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erreur lors de l'envoi");

    formStatus.textContent = "Votre demande a bien été envoyée. Nous vous recontacterons rapidement.";
    formStatus.className = "form-status success";
    contactForm.reset();
  } catch (err) {
    console.error(err);
    formStatus.textContent = "Une erreur est survenue. Merci de réessayer ou de nous contacter directement.";
    formStatus.className = "form-status error";
  }
});

loadFormation().catch((err) => {
  console.error(err);
  detailEl.innerHTML = `<p>Impossible de charger la formation.</p>`;
});
