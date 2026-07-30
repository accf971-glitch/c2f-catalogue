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

module.exports = { sendContactNotification };
