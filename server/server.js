require("dotenv").config();

const path = require("path");
const express = require("express");
const db = require("./db");
const { sendContactNotification } = require("./mailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// ---- Categories ----

app.get("/api/categories", (req, res) => {
  const categories = db.prepare("SELECT id, slug, name FROM categories ORDER BY name").all();
  res.json(categories);
});

// ---- Formations ----

app.get("/api/formations", (req, res) => {
  const { category, format, certifiante, cpf, lieu, q } = req.query;

  let sql = `
    SELECT f.id, f.slug, f.title, f.format, f.duration_hours, f.duration_days,
           f.certifiante, f.cpf_eligible, f.lieu, f.accessible, f.summary, f.image_emoji,
           f.satisfaction_rate,
           c.slug AS category_slug, c.name AS category_name
    FROM formations f
    JOIN categories c ON c.id = f.category_id
    WHERE 1 = 1
  `;
  const params = {};

  if (category) {
    sql += " AND c.slug = @category";
    params.category = category;
  }
  if (format) {
    sql += " AND f.format = @format";
    params.format = format;
  }
  if (certifiante === "1" || certifiante === "0") {
    sql += " AND f.certifiante = @certifiante";
    params.certifiante = Number(certifiante);
  }
  if (cpf === "1" || cpf === "0") {
    sql += " AND f.cpf_eligible = @cpf";
    params.cpf = Number(cpf);
  }
  if (lieu) {
    sql += " AND f.lieu = @lieu";
    params.lieu = lieu;
  }
  if (q) {
    sql += " AND (f.title LIKE @q OR f.summary LIKE @q)";
    params.q = `%${q}%`;
  }

  sql += " ORDER BY c.name, f.title";

  const rows = db.prepare(sql).all(params);
  res.json(rows);
});

app.get("/api/formations/:id", (req, res) => {
  const row = db
    .prepare(
      `SELECT f.*, c.slug AS category_slug, c.name AS category_name
       FROM formations f
       JOIN categories c ON c.id = f.category_id
       WHERE f.id = ? OR f.slug = ?`
    )
    .get(req.params.id, req.params.id);

  if (!row) return res.status(404).json({ error: "Formation introuvable" });
  res.json(row);
});

// ---- Contact / demande de devis ----

app.post("/api/contact", async (req, res) => {
  const { formation_id, nom, email, telephone, message } = req.body || {};

  if (!nom || !email) {
    return res.status(400).json({ error: "Le nom et l'email sont requis." });
  }

  const info = db
    .prepare(
      `INSERT INTO contacts (formation_id, nom, email, telephone, message)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(formation_id || null, nom, email, telephone || null, message || null);

  res.status(201).json({ id: info.lastInsertRowid });

  const formation = formation_id
    ? db.prepare("SELECT title FROM formations WHERE id = ?").get(formation_id)
    : null;

  try {
    await sendContactNotification({
      nom,
      email,
      telephone,
      message,
      formationTitle: formation ? formation.title : null
    });
  } catch (err) {
    console.error("Échec de l'envoi de l'email de notification :", err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Catalogue C2F disponible sur http://localhost:${PORT}`);
});
