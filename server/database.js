import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "incidents.db");

export const db = new sqlite3.Database(dbPath);

export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Enable foreign keys
      db.run("PRAGMA foreign_keys = ON");

      // Create incidents table
      db.run(`
        CREATE TABLE IF NOT EXISTS incidents (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          service TEXT NOT NULL,
          severity TEXT NOT NULL CHECK(severity IN ('SEV1', 'SEV2', 'SEV3', 'SEV4')),
          status TEXT NOT NULL CHECK(status IN ('OPEN', 'MITIGATED', 'RESOLVED')) DEFAULT 'OPEN',
          owner TEXT,
          summary TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
      });

      // Create indexes
      db.run("CREATE INDEX IF NOT EXISTS idx_status ON incidents(status)");
      db.run("CREATE INDEX IF NOT EXISTS idx_severity ON incidents(severity)");
      db.run("CREATE INDEX IF NOT EXISTS idx_service ON incidents(service)");
      db.run("CREATE INDEX IF NOT EXISTS idx_createdAt ON incidents(createdAt)");
      db.run("CREATE INDEX IF NOT EXISTS idx_title ON incidents(title)", (err) => {
        if (err) reject(err);
        console.log("Database initialized");
        resolve();
      });
    });
  });
}

// Helper function to run queries
export function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      resolve(this);
    });
  });
}

// Helper function to get single row
export function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row);
    });
  });
}

// Helper function to get all rows
export function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
}
