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

const devisModal = document.getElementById("devisModal");
const closeDevisModalBtn = document.getElementById("closeDevisModal");
const devisForm = document.getElementById("devisForm");
const devisStatus = document.getElementById("devisStatus");
const devisFormationTitle = document.getElementById("devisFormationTitle");
const devisParticipantsInput = document.getElementById("devisParticipants");
const devisEstimation = document.getElementById("devisEstimation");

let currentFormation = null;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function formatEuros(amount) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

function formatPrice(prixHt) {
  return prixHt != null ? `${formatEuros(prixHt)} HT` : "Sur devis";
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
      ${renderInfoCards()}
    </div>

    <aside class="sidebar-card">
      <div class="info-row price"><span>Prix</span><span>${formatPrice(f.prix_ht)}</span></div>
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
      <button class="review-button" id="openDevis">Demander un devis</button>
    </aside>
  `;

  document.getElementById("openContact").addEventListener("click", openModal);
  document.getElementById("openDevis").addEventListener("click", openDevisModal);
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

function renderInfoCards() {
  return `
    <div class="detail-section">
      <div class="info-card-grid">
        <div class="info-card">
          <div class="info-card-icon">🧑‍🏫</div>
          <h3>Équipe pédagogique</h3>
          <p><strong>Des experts engagés pour votre transformation</strong></p>
          <p>L'équipe pédagogique de C2F est composée de formateurs-consultants expérimentés, coachs professionnels certifiés et accompagnants qualifiés, mobilisés autour d'une même mission : vous accompagner dans le développement de vos compétences, en respectant votre singularité, vos objectifs et votre rythme.</p>
          <p>Chaque intervenant est sélectionné pour :</p>
          <ul class="check-list">
            <li>Son expertise métier confirmée</li>
            <li>Sa capacité à transmettre avec clarté, méthode et pédagogie</li>
            <li>Son engagement dans une posture d'écoute, d'accompagnement et de bienveillance</li>
            <li>Sa maîtrise des outils pédagogiques innovants (formation à distance, classe inversée, pédagogie active, outils numériques)</li>
          </ul>
          <p>Notre équipe s'appuie sur des référentiels actualisés, des pratiques éprouvées, et un accompagnement humain sur mesure, en lien constant avec vos besoins et ceux du monde professionnel.</p>
          <p>Au sein de C2F, vous n'êtes jamais seul : chaque formateur agit comme un véritable partenaire de votre montée en compétences et vous guide vers l'atteinte de vos objectifs avec exigence, clarté et enthousiasme.</p>
          <p>🎯 Se former pour se transformer : notre engagement, c'est votre progression durable.</p>
        </div>

        <div class="info-card">
          <div class="info-card-icon">📋</div>
          <h3>Suivi de l'exécution et évaluation des résultats</h3>
          <ul>
            <li>Contrat d'objectifs qui permet de vérifier que les objectifs individuels fixés en amont de la formation soient réalisés à la fin de la formation</li>
            <li>Accompagnement individuel du bénéficiaire via la plateforme pédagogique</li>
            <li>Feuille d'émargement qui permet de valider l'assiduité du bénéficiaire</li>
            <li>Formulaire d'évaluation de la formation</li>
            <li>Certificat de réalisation de l'action de formation</li>
            <li>Questionnaires, tests, enquêtes métiers</li>
          </ul>
        </div>

        <div class="info-card info-card-full">
          <div class="info-card-icon">🛠️</div>
          <h3>Ressources techniques et pédagogiques</h3>
          <ul>
            <li>Plateforme pédagogique et e-learning individuelle où le bénéficiaire pourra retrouver l'ensemble des livrables, tests, documents et commentaires de l'intervenant pour suivi de la progression dans le parcours de formation</li>
            <li>Mise à disposition en ligne de documents supports de la formation</li>
            <li>Tests spécialisés (psychométriques)</li>
            <li>Outils de questionnements</li>
            <li>Un livret d'accompagnement est complété à l'issue de chaque séance et rythme le déroulement du bilan de compétences</li>
          </ul>
        </div>
      </div>
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

function openDevisModal() {
  devisFormationTitle.textContent = currentFormation ? currentFormation.title : "";
  devisStatus.textContent = "";
  devisStatus.className = "form-status";
  devisForm.reset();
  updateDevisEstimation();
  devisModal.classList.remove("hidden");
}

function closeDevisModal() {
  devisModal.classList.add("hidden");
}

function updateDevisEstimation() {
  const prixHt = currentFormation ? currentFormation.prix_ht : null;
  const participants = Math.max(1, Number(devisParticipantsInput.value) || 1);

  devisEstimation.textContent =
    prixHt != null
      ? `Estimation : ${formatEuros(prixHt * participants)} HT (${participants} participant${participants > 1 ? "s" : ""} × ${formatEuros(prixHt)})`
      : "Cette formation est proposée sur devis : nous vous enverrons un chiffrage personnalisé.";
}

devisParticipantsInput.addEventListener("input", updateDevisEstimation);

closeDevisModalBtn.addEventListener("click", closeDevisModal);
devisModal.addEventListener("click", (e) => {
  if (e.target === devisModal) closeDevisModal();
});

devisForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    type: "devis",
    formation_id: currentFormation ? currentFormation.id : null,
    nom: document.getElementById("devisNom").value.trim(),
    email: document.getElementById("devisEmail").value.trim(),
    telephone: document.getElementById("devisTelephone").value.trim(),
    societe: document.getElementById("devisSociete").value.trim(),
    participants: Math.max(1, Number(devisParticipantsInput.value) || 1),
    message: document.getElementById("devisMessage").value.trim()
  };

  devisStatus.textContent = "Envoi en cours...";
  devisStatus.className = "form-status";

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Erreur lors de l'envoi");

    devisStatus.textContent = "Votre demande de devis a bien été envoyée. Nous vous recontacterons rapidement.";
    devisStatus.className = "form-status success";
    devisForm.reset();
  } catch (err) {
    console.error(err);
    devisStatus.textContent = "Une erreur est survenue. Merci de réessayer ou de nous contacter directement.";
    devisStatus.className = "form-status error";
  }
});

loadFormation().catch((err) => {
  console.error(err);
  detailEl.innerHTML = `<p>Impossible de charger la formation.</p>`;
});
