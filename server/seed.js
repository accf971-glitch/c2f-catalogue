const db = require("./db");

function programme(phases) {
  return JSON.stringify(phases);
}

function phase(title, duration, items) {
  return { title, duration: duration || null, items };
}

function item(title, details) {
  return { title, details: details || null };
}

const categories = [
  { slug: "bilan-de-competences", name: "Bilan de Compétences" },
  { slug: "vae", name: "Validation des Acquis de l'Expérience" },
  { slug: "management-communication", name: "Management et Communication" },
  { slug: "competences-transverses", name: "Compétences Transverses" }
];

const formations = [
  {
    category: "bilan-de-competences",
    slug: "bilan-competences-classique",
    title: "Bilan de Compétences - Classique",
    format: "mixte",
    duration_hours: 24,
    duration_days: null,
    certifiante: 0,
    cpf_eligible: 1,
    lieu: "Baie-Mahault",
    public_vise: "Tout salarié ou demandeur d'emploi souhaitant faire le point sur son parcours professionnel.",
    prerequis: "Aucun prérequis.",
    objectifs: "Analyser ses compétences professionnelles et personnelles, ses aptitudes et motivations ; définir un projet professionnel et, le cas échéant, un projet de formation.",
    programme: programme([
      phase("Phase préliminaire", "2h d'entretiens personnalisés", [
        item("Analyse de la demande")
      ]),
      phase("Phase d'investigation", "jusqu'à 16h de formation dont 4h d'entretiens personnalisés", [
        item("Compétences"),
        item("Intérêts"),
        item("Valeurs")
      ]),
      phase("Phase de conclusion", "jusqu'à 6h de formation dont 2h d'entretiens personnalisés", [
        item("Synthèse"),
        item("Plan d'action")
      ])
    ]),
    summary: "L'accompagnement de référence pour faire le point sur votre parcours et construire un projet professionnel solide.",
    image_emoji: "🧭",
    prix_ht: null,
  },
  {
    category: "bilan-de-competences",
    slug: "bilan-competences-realisation",
    title: "Bilan de Compétences - Réalisation",
    format: "mixte",
    duration_hours: 24,
    duration_days: null,
    certifiante: 0,
    cpf_eligible: 1,
    lieu: "Baie-Mahault",
    public_vise: "Tout public.",
    prerequis: "Aucun prérequis.",
    objectifs: "Clarifier sa demande et l'objectif du bilan ; identifier les compétences mobilisables pour un projet de VAE ou de formation ; valider la faisabilité d'un projet professionnel ou en construire une alternative réaliste ; structurer un plan d'action concret.",
    programme: programme([
      phase("Phase préliminaire", "2h d'entretiens personnalisés", [
        item("Clarifier sa demande et ses attentes", [
          "Présentation de la démarche et de ses objectifs",
          "Exploration de la situation et du contexte professionnel actuel",
          "Identification des motivations, freins et ressources",
          "Formalisation de l'objectif et des attentes"
        ])
      ]),
      phase("Phase d'investigation", "jusqu'à 16h de formation dont 4h d'entretiens personnalisés", [
        item("Analyse du parcours et des compétences", [
          "Distinction entre contexte et logique de choix",
          "Analyse détaillée de l'expérience professionnelle",
          "Identification des faits marquants et points d'appui"
        ]),
        item("Évaluation du degré de maîtrise", [
          "Identification des compétences techniques, transversales et comportementales",
          "Auto-évaluation à l'aide de grilles adaptées",
          "Vérification à travers des exemples de mise en œuvre"
        ]),
        item("Valorisation des acquis", [
          "Sélection des expériences significatives",
          "Analyse des résultats et de la valeur créée",
          "Élaboration d'un portefeuille de compétences ou profil professionnel"
        ]),
        item("Définition ou validation du projet", [
          "Synthèse du bilan",
          "Émergence du projet (VAE, emploi, reconversion, création)",
          "Application des critères de validation"
        ]),
        item("Enquête terrain ou test du projet", [
          "Analyse de l'écart entre perception et réalité du métier visé",
          "Grilles d'entretien et identification de contacts",
          "Analyse des retours et ajustements du projet"
        ])
      ]),
      phase("Phase de conclusion", "jusqu'à 6h de formation dont 2h d'entretiens personnalisés", [
        item("Élaboration du plan d'action", [
          "Définition des grandes étapes du projet",
          "Calendrier et priorisation des actions",
          "Formalisation d'un plan d'action écrit et partagé",
          "Rédaction de la synthèse confidentielle"
        ])
      ])
    ]),
    summary: "Pour transformer un projet professionnel déjà identifié en plan d'action concret et réaliste.",
    image_emoji: "🚀",
    prix_ht: 1200,
  },
  {
    category: "bilan-de-competences",
    slug: "bilan-competences-effectuation",
    title: "Bilan de Compétences - Effectuation",
    format: "mixte",
    duration_hours: 24,
    duration_days: null,
    certifiante: 0,
    cpf_eligible: 1,
    lieu: "Baie-Mahault",
    public_vise: "Personnes en reconversion souhaitant avancer par l'action plutôt que par une planification classique.",
    prerequis: "Aucun prérequis.",
    objectifs: "Utiliser l'approche par l'effectuation pour construire son projet à partir de ses ressources actuelles et avancer par petits pas testés.",
    programme: programme([
      phase("Identification des ressources", null, [
        item("Qui je suis"),
        item("Ce que je sais"),
        item("Qui je connais")
      ]),
      phase("Construction itérative du projet", null, []),
      phase("Expérimentations terrain", null, [])
    ]),
    summary: "Une approche innovante du bilan, fondée sur l'action et l'expérimentation plutôt que sur la planification.",
    image_emoji: "🧩",
    prix_ht: null,
  },
  {
    category: "bilan-de-competences",
    slug: "bilan-competences-total",
    title: "Bilan de Compétences - Total",
    format: "mixte",
    duration_hours: 24,
    duration_days: null,
    certifiante: 0,
    cpf_eligible: 1,
    lieu: "Baie-Mahault",
    public_vise: "Toute personne souhaitant un accompagnement complet, du diagnostic jusqu'au plan d'action final.",
    prerequis: "Aucun prérequis.",
    objectifs: "Couvrir l'ensemble des dimensions du bilan : compétences, personnalité, motivations, marché de l'emploi et plan d'action.",
    programme: programme([
      phase("Diagnostic complet", null, []),
      phase("Exploration des pistes professionnelles", null, []),
      phase("Étude de marché", null, []),
      phase("Plan d'action final et suivi à 6 mois", null, [])
    ]),
    summary: "La formule la plus complète pour un accompagnement en profondeur, du diagnostic au suivi post-bilan.",
    image_emoji: "🎯",
    prix_ht: null,
  },
  {
    category: "vae",
    slug: "vae-accompagnement",
    title: "Validation des Acquis de l'Expérience (VAE)",
    format: "mixte",
    duration_hours: 24,
    duration_days: null,
    certifiante: 1,
    cpf_eligible: 1,
    lieu: "Baie-Mahault",
    public_vise: "Toute personne justifiant d'au moins un an d'expérience en lien avec la certification visée.",
    prerequis: "Justifier d'une expérience professionnelle ou bénévole en rapport avec la certification visée.",
    objectifs: "Faire valider son expérience par un diplôme, titre ou certification professionnelle sans reprendre un cursus de formation complet.",
    programme: programme([
      phase("Recevabilité du dossier", null, []),
      phase("Rédaction du dossier de VAE", null, []),
      phase("Préparation à l'entretien avec le jury", null, []),
      phase("Accompagnement post-jury", null, [])
    ]),
    summary: "Faites reconnaître votre expérience professionnelle par une certification officielle.",
    image_emoji: "🏅",
    prix_ht: null,
  },
  {
    category: "management-communication",
    slug: "devenir-manager-coach",
    title: "Devenir Manager Coach",
    format: "mixte",
    duration_hours: 21,
    duration_days: 3,
    certifiante: 0,
    cpf_eligible: 0,
    lieu: "Baie-Mahault",
    public_vise: "Managers et futurs managers souhaitant développer une posture de coach.",
    prerequis: "Occuper ou viser un poste d'encadrement.",
    objectifs: "Adopter une posture managériale de type coach : écoute active, questionnement, délégation et accompagnement du développement des équipes.",
    programme: programme([
      phase("Fondamentaux de la posture de coach", null, []),
      phase("Techniques d'écoute active et de questionnement", null, []),
      phase("Entretiens de développement", null, []),
      phase("Mises en situation", null, [])
    ]),
    summary: "Développez une posture managériale qui fait grandir vos équipes au lieu de simplement les diriger.",
    image_emoji: "🧑‍🏫",
    prix_ht: null,
  },
  {
    category: "management-communication",
    slug: "devenir-manager-coach-decouverte",
    title: "Devenir Manager Coach - Programme de Découverte",
    format: "distanciel",
    duration_hours: 7,
    duration_days: 1,
    certifiante: 0,
    cpf_eligible: 0,
    lieu: "À distance",
    public_vise: "Managers curieux de découvrir l'approche coaching avant de s'engager sur le programme complet.",
    prerequis: "Aucun prérequis.",
    objectifs: "Découvrir les principes clés de la posture de manager coach et évaluer l'intérêt d'un accompagnement complet.",
    programme: programme([
      phase("Introduction à la posture de coach", null, []),
      phase("Autodiagnostic de son style managérial", null, []),
      phase("Premiers outils applicables immédiatement", null, [])
    ]),
    summary: "Une journée pour découvrir les bases du management par le coaching, à distance.",
    image_emoji: "💡",
    prix_ht: null,
  },
  {
    category: "management-communication",
    slug: "histoire-de-vie-construction-identitaire",
    title: "Histoire de Vie et Construction Identitaire",
    format: "presentiel",
    duration_hours: 21,
    duration_days: 3,
    certifiante: 0,
    cpf_eligible: 0,
    lieu: "Baie-Mahault",
    public_vise: "Professionnels de l'accompagnement, RH, formateurs, coachs.",
    prerequis: "Aucun prérequis.",
    objectifs: "Utiliser le récit de vie comme outil de construction identitaire et professionnelle, pour soi et pour accompagner autrui.",
    programme: programme([
      phase("Théories de l'histoire de vie", null, []),
      phase("Techniques de récit biographique", null, []),
      phase("Animation d'ateliers de récit de vie", null, [])
    ]),
    summary: "Explorez le récit de vie comme levier de développement personnel et professionnel.",
    image_emoji: "📖",
    prix_ht: null,
  },
  {
    category: "management-communication",
    slug: "fondamentaux-management-responsable",
    title: "Les Fondamentaux du Management Responsable",
    format: "presentiel",
    duration_hours: 12,
    duration_days: 1,
    certifiante: 0,
    cpf_eligible: 0,
    lieu: "Baie-Mahault",
    public_vise: "Managers souhaitant intégrer une dimension éthique et durable dans leur pratique managériale.",
    prerequis: "Occuper un poste d'encadrement.",
    objectifs: "Intégrer les enjeux RSE et de qualité de vie au travail dans ses pratiques managériales quotidiennes.",
    programme: programme([
      phase("Enjeux du management responsable", null, []),
      phase("Qualité de vie au travail", null, []),
      phase("Management inclusif", null, []),
      phase("Plan d'action individuel", null, [])
    ]),
    summary: "Une journée pour ancrer une pratique managériale plus responsable et durable.",
    image_emoji: "🌱",
    prix_ht: null,
  },
  {
    category: "management-communication",
    slug: "manager-par-la-communication",
    title: "Manager par la Communication",
    format: "mixte",
    duration_hours: 14,
    duration_days: 2,
    certifiante: 0,
    cpf_eligible: 0,
    lieu: "Baie-Mahault",
    public_vise: "Managers souhaitant renforcer l'impact de leur communication auprès de leurs équipes.",
    prerequis: "Occuper un poste d'encadrement.",
    objectifs: "Maîtriser les techniques de communication managériale : feedback, gestion des tensions, communication en réunion.",
    programme: programme([
      phase("Communication verbale et non-verbale", null, []),
      phase("Feedback constructif", null, []),
      phase("Gestion des situations difficiles", null, []),
      phase("Communication en réunion", null, [])
    ]),
    summary: "Renforcez votre impact managérial grâce à une communication plus claire et plus efficace.",
    image_emoji: "🗣️",
    prix_ht: null,
  }
];

const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO categories (slug, name) VALUES (@slug, @name)"
);
const getCategoryId = db.prepare("SELECT id FROM categories WHERE slug = ?");

const insertFormation = db.prepare(`
  INSERT INTO formations
    (category_id, slug, title, format, duration_hours, duration_days, certifiante,
     cpf_eligible, lieu, accessible, public_vise, prerequis, objectifs, programme, summary,
     image_emoji, prix_ht)
  VALUES
    (@category_id, @slug, @title, @format, @duration_hours, @duration_days, @certifiante,
     @cpf_eligible, @lieu, 1, @public_vise, @prerequis, @objectifs, @programme, @summary,
     @image_emoji, @prix_ht)
  ON CONFLICT(slug) DO UPDATE SET
    category_id = excluded.category_id,
    title = excluded.title,
    format = excluded.format,
    duration_hours = excluded.duration_hours,
    duration_days = excluded.duration_days,
    certifiante = excluded.certifiante,
    cpf_eligible = excluded.cpf_eligible,
    lieu = excluded.lieu,
    public_vise = excluded.public_vise,
    prerequis = excluded.prerequis,
    objectifs = excluded.objectifs,
    programme = excluded.programme,
    summary = excluded.summary,
    image_emoji = excluded.image_emoji,
    prix_ht = excluded.prix_ht
`);

function seed() {
  db.exec("BEGIN");
  try {
    for (const c of categories) insertCategory.run(c);

    for (const f of formations) {
      const cat = getCategoryId.get(f.category);
      if (!cat) throw new Error(`Catégorie inconnue: ${f.category}`);
      const { category, ...rest } = f;
      insertFormation.run({ ...rest, category_id: cat.id });
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

seed();

console.log(`Seed terminé : ${categories.length} catégories, ${formations.length} formations.`);
