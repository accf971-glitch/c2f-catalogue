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

const avisModal = document.getElementById("avisModal");
const closeAvisModalBtn = document.getElementById("closeAvisModal");
const avisForm = document.getElementById("avisForm");
const avisStatus = document.getElementById("avisStatus");
const avisFormationTitle = document.getElementById("avisFormationTitle");
const starRating = document.getElementById("starRating");

let currentFormation = null;
let selectedNote = 0;

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
      ${renderProgramme(f.programme)}
    </div>

    <aside class="sidebar-card">
      <div class="info-row"><span>Format</span><span>${FORMAT_LABELS[f.format] || f.format}</span></div>
      <div class="info-row"><span>Durée</span><span>${duration}</span></div>
      <div class="info-row"><span>Lieu</span><span>${escapeHtml(f.lieu || "-")}</span></div>
      <div class="info-row"><span>Certifiante</span><span>${f.certifiante ? "Oui" : "Non"}</span></div>
      <div class="info-row"><span>Éligible CPF</span><span>${f.cpf_eligible ? "Oui" : "Non"}</span></div>
      <div class="info-row satisfaction">
        <span>Taux de satisfaction</span>
        <span>${
          f.avis_count > 0
            ? `⭐ ${f.satisfaction_rate}% (${f.avis_count} avis)`
            : "Pas encore d'avis"
        }</span>
      </div>
      <button class="cta-button" id="openContact">Demander des informations</button>
      <button class="review-button" id="openAvis">Donner mon avis</button>
    </aside>
  `;

  document.getElementById("openContact").addEventListener("click", openModal);
  document.getElementById("openAvis").addEventListener("click", openAvisModal);
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

function renderProgramme(programmeJson) {
  let phases;
  try {
    phases = JSON.parse(programmeJson);
  } catch {
    return "";
  }
  if (!Array.isArray(phases) || phases.length === 0) return "";

  const phasesHtml = phases
    .map((p) => {
      const hasItems = Array.isArray(p.items) && p.items.length > 0;
      const durationText = p.duration ? ` - ${escapeHtml(p.duration)}` : "";
      const suffix = hasItems ? " - qui comprend :" : "";

      const itemsHtml = hasItems
        ? p.items
            .map((it) => {
              if (Array.isArray(it.details) && it.details.length > 0) {
                return `
                  <details class="programme-item">
                    <summary>${escapeHtml(it.title)}</summary>
                    <ul>${it.details.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
                  </details>
                `;
              }
              return `<div class="programme-item programme-item-flat">${escapeHtml(it.title)}</div>`;
            })
            .join("")
        : "";

      return `
        <div class="programme-phase-banner">
          <span class="check">✅</span>
          <span>${escapeHtml(p.title)}${durationText}${suffix}</span>
        </div>
        ${itemsHtml}
      `;
    })
    .join("");

  return `
    <div class="detail-section">
      <h2>📖 Contenu de la formation</h2>
      ${phasesHtml}
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

function openAvisModal() {
  avisFormationTitle.textContent = currentFormation ? currentFormation.title : "";
  avisStatus.textContent = "";
  avisStatus.className = "form-status";
  avisForm.reset();
  setSelectedNote(0);
  avisModal.classList.remove("hidden");
}

function closeAvisModal() {
  avisModal.classList.add("hidden");
}

function setSelectedNote(note) {
  selectedNote = note;
  [...starRating.querySelectorAll(".star")].forEach((star) => {
    star.classList.toggle("filled", Number(star.dataset.value) <= note);
  });
}

starRating.querySelectorAll(".star").forEach((star) => {
  star.addEventListener("click", () => setSelectedNote(Number(star.dataset.value)));
});

closeAvisModalBtn.addEventListener("click", closeAvisModal);
avisModal.addEventListener("click", (e) => {
  if (e.target === avisModal) closeAvisModal();
});

avisForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!selectedNote) {
    avisStatus.textContent = "Merci de sélectionner une note (1 à 5 étoiles).";
    avisStatus.className = "form-status error";
    return;
  }

  avisStatus.textContent = "Envoi en cours...";
  avisStatus.className = "form-status";

  try {
    const res = await fetch(`/api/formations/${currentFormation.id}/avis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: selectedNote,
        commentaire: document.getElementById("commentaire").value.trim()
      })
    });

    if (!res.ok) throw new Error("Erreur lors de l'envoi");

    const updated = await res.json();
    currentFormation.satisfaction_rate = updated.satisfaction_rate;
    currentFormation.avis_count = updated.avis_count;
    render(currentFormation);

    avisStatus.textContent = "Merci pour votre avis !";
    avisStatus.className = "form-status success";
    setTimeout(closeAvisModal, 1200);
  } catch (err) {
    console.error(err);
    avisStatus.textContent = "Une erreur est survenue. Merci de réessayer.";
    avisStatus.className = "form-status error";
  }
});

loadFormation().catch((err) => {
  console.error(err);
  detailEl.innerHTML = `<p>Impossible de charger la formation.</p>`;
});
