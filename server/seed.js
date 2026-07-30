const db = require("./db");

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
    programme: "Phase préliminaire (analyse de la demande) ; Phase d'investigation (compétences, intérêts, valeurs) ; Phase de conclusion (synthèse et plan d'action).",
    summary: "L'accompagnement de référence pour faire le point sur votre parcours et construire un projet professionnel solide.",
    image_emoji: "🧭",
    satisfaction_rate: 94
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
    public_vise: "Personnes ayant déjà un projet professionnel à affiner et à concrétiser.",
    prerequis: "Avoir une première idée de projet professionnel.",
    objectifs: "Passer du projet à sa mise en œuvre concrète : plan d'action détaillé, étapes, ressources et échéances.",
    programme: "Validation du projet ; Étude de faisabilité ; Construction du plan d'action opérationnel ; Suivi de la mise en œuvre.",
    summary: "Pour transformer un projet professionnel déjà identifié en plan d'action concret et réaliste.",
    image_emoji: "🚀",
    satisfaction_rate: 92
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
    programme: "Identification des ressources (qui je suis, ce que je sais, qui je connais) ; Construction itérative du projet ; Expérimentations terrain.",
    summary: "Une approche innovante du bilan, fondée sur l'action et l'expérimentation plutôt que sur la planification.",
    image_emoji: "🧩",
    satisfaction_rate: 89
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
    programme: "Diagnostic complet ; Exploration des pistes professionnelles ; Étude de marché ; Plan d'action final et suivi à 6 mois.",
    summary: "La formule la plus complète pour un accompagnement en profondeur, du diagnostic au suivi post-bilan.",
    image_emoji: "🎯",
    satisfaction_rate: 96
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
    programme: "Recevabilité du dossier ; Rédaction du dossier de VAE ; Préparation à l'entretien avec le jury ; Accompagnement post-jury.",
    summary: "Faites reconnaître votre expérience professionnelle par une certification officielle.",
    image_emoji: "🏅",
    satisfaction_rate: 91
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
    programme: "Fondamentaux de la posture de coach ; Techniques d'écoute active et de questionnement ; Entretiens de développement ; Mises en situation.",
    summary: "Développez une posture managériale qui fait grandir vos équipes au lieu de simplement les diriger.",
    image_emoji: "🧑‍🏫",
    satisfaction_rate: 95
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
    programme: "Introduction à la posture de coach ; Autodiagnostic de son style managérial ; Premiers outils applicables immédiatement.",
    summary: "Une journée pour découvrir les bases du management par le coaching, à distance.",
    image_emoji: "💡",
    satisfaction_rate: 88
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
    programme: "Théories de l'histoire de vie ; Techniques de récit biographique ; Animation d'ateliers de récit de vie.",
    summary: "Explorez le récit de vie comme levier de développement personnel et professionnel.",
    image_emoji: "📖",
    satisfaction_rate: 90
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
    programme: "Enjeux du management responsable ; Qualité de vie au travail ; Management inclusif ; Plan d'action individuel.",
    summary: "Une journée pour ancrer une pratique managériale plus responsable et durable.",
    image_emoji: "🌱",
    satisfaction_rate: 93
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
    programme: "Communication verbale et non-verbale ; Feedback constructif ; Gestion des situations difficiles ; Communication en réunion.",
    summary: "Renforcez votre impact managérial grâce à une communication plus claire et plus efficace.",
    image_emoji: "🗣️",
    satisfaction_rate: 97
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
     image_emoji, satisfaction_rate)
  VALUES
    (@category_id, @slug, @title, @format, @duration_hours, @duration_days, @certifiante,
     @cpf_eligible, @lieu, 1, @public_vise, @prerequis, @objectifs, @programme, @summary,
     @image_emoji, @satisfaction_rate)
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
    satisfaction_rate = excluded.satisfaction_rate
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
