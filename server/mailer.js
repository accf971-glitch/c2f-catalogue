const nodemailer = require("nodemailer");

const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_NOTIFY_EMAIL } = process.env;

const transporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
      })
    : null;

async function sendContactNotification({ nom, email, telephone, message, formationTitle }) {
  if (!transporter) {
    console.warn("Email non envoyé : GMAIL_USER / GMAIL_APP_PASSWORD manquants dans .env");
    return;
  }

  const notifyTo = CONTACT_NOTIFY_EMAIL || GMAIL_USER;
  const sujet = formationTitle
    ? `Nouvelle demande d'information - ${formationTitle}`
    : "Nouvelle demande d'information";

  await transporter.sendMail({
    from: `"Catalogue C2F" <${GMAIL_USER}>`,
    to: notifyTo,
    replyTo: email,
    subject: sujet,
    text: [
      formationTitle ? `Formation concernée : ${formationTitle}` : null,
      `Nom : ${nom}`,
      `Email : ${email}`,
      telephone ? `Téléphone : ${telephone}` : null,
      message ? `Message :\n${message}` : null
    ]
      .filter(Boolean)
      .join("\n")
  });

  await transporter.sendMail({
    from: `"C2F Antilles" <${GMAIL_USER}>`,
    to: email,
    subject: "Votre demande d'information - C2F Antilles",
    text: `Bonjour ${nom},

Nous avons bien reçu votre demande d'information${formationTitle ? ` concernant la formation "${formationTitle}"` : ""}.
Notre équipe vous recontactera dans les meilleurs délais.

SE FORMER POUR SE TRANSFORMER
C2F Antilles`
  });
}

function formatEuros(amount) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

async function sendDevisNotification({
  nom,
  email,
  telephone,
  societe,
  participants,
  message,
  formationTitle,
  prixHt
}) {
  if (!transporter) {
    console.warn("Email non envoyé : GMAIL_USER / GMAIL_APP_PASSWORD manquants dans .env");
    return;
  }

  const notifyTo = CONTACT_NOTIFY_EMAIL || GMAIL_USER;
  const sujet = formationTitle ? `Nouvelle demande de devis - ${formationTitle}` : "Nouvelle demande de devis";

  const totalHt = prixHt != null ? prixHt * participants : null;
  const ligneMontant =
    prixHt != null
      ? `Prix unitaire HT : ${formatEuros(prixHt)}\nParticipants : ${participants}\nTotal estimé HT : ${formatEuros(totalHt)} (hors TVA éventuellement applicable, à confirmer)`
      : "Cette formation est proposée sur devis : aucun prix catalogue à calculer automatiquement, un chiffrage personnalisé doit être établi.";

  await transporter.sendMail({
    from: `"Catalogue C2F" <${GMAIL_USER}>`,
    to: notifyTo,
    replyTo: email,
    subject: sujet,
    text: [
      formationTitle ? `Formation concernée : ${formationTitle}` : null,
      `Nom : ${nom}`,
      `Email : ${email}`,
      telephone ? `Téléphone : ${telephone}` : null,
      societe ? `Société : ${societe}` : null,
      "",
      ligneMontant,
      "",
      message ? `Message :\n${message}` : null
    ]
      .filter((line) => line !== null)
      .join("\n")
  });

  await transporter.sendMail({
    from: `"C2F Antilles" <${GMAIL_USER}>`,
    to: email,
    subject: "Votre demande de devis - C2F Antilles",
    text: `Bonjour ${nom},

Nous avons bien reçu votre demande de devis${formationTitle ? ` pour la formation "${formationTitle}"` : ""}${participants > 1 ? ` pour ${participants} participants` : ""}.
${prixHt != null ? `Montant indicatif HT : ${formatEuros(totalHt)}.\n` : ""}Notre équipe vous recontactera avec un devis détaillé dans les meilleurs délais.

SE FORMER POUR SE TRANSFORMER
C2F Antilles`
  });
}

module.exports = { sendContactNotification, sendDevisNotification };
