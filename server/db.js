const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const dbPath = path.join(__dirname, "data", "catalogue.db");
const db = new DatabaseSync(dbPath);

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    slug  TEXT UNIQUE NOT NULL,
    name  TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS formations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id     INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    slug            TEXT UNIQUE NOT NULL,
    title           TEXT NOT NULL,
    format          TEXT NOT NULL CHECK (format IN ('presentiel','distanciel','mixte','elearning','alternance','stage')),
    duration_hours  INTEGER NOT NULL,
    duration_days   INTEGER,
    certifiante     INTEGER NOT NULL DEFAULT 0,
    cpf_eligible    INTEGER NOT NULL DEFAULT 0,
    lieu            TEXT,
    accessible      INTEGER NOT NULL DEFAULT 1,
    public_vise     TEXT,
    prerequis       TEXT,
    objectifs       TEXT,
    programme       TEXT,
    summary         TEXT,
    image_emoji     TEXT DEFAULT '📘',
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    formation_id INTEGER REFERENCES formations(id) ON DELETE SET NULL,
    nom          TEXT NOT NULL,
    email        TEXT NOT NULL,
    telephone    TEXT,
    message      TEXT,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
