import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "incidents.db");

const db = new sqlite3.Database(dbPath);

function queryDatabase() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM incidents ORDER BY createdAt DESC LIMIT 20", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getStats() {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT COUNT(*) as total, MAX(createdAt) as latest FROM incidents",
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}

function getByStatus(status) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM incidents WHERE status = ? ORDER BY createdAt DESC",
      [status],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

function getBySeverity(severity) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM incidents WHERE severity = ? ORDER BY createdAt DESC",
      [severity],
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

async function main() {
  try {
    const command = process.argv[2];

    if (command === "stats") {
      const stats = await getStats();
      console.log("\n📊 Database Statistics:");
      console.log(`Total Incidents: ${stats.total}`);
      console.log(`Latest: ${stats.latest}\n`);
    } else if (command === "status" && process.argv[3]) {
      const status = process.argv[3];
      const incidents = await getByStatus(status);
      console.log(`\n📋 Incidents with status: ${status}`);
      console.log(`Found: ${incidents.length}\n`);
      incidents.forEach((inc, i) => {
        console.log(`${i + 1}. ${inc.title}`);
        console.log(`   Service: ${inc.service} | Severity: ${inc.severity}`);
        console.log(`   Owner: ${inc.owner || "N/A"}\n`);
      });
    } else if (command === "severity" && process.argv[3]) {
      const severity = process.argv[3];
      const incidents = await getBySeverity(severity);
      console.log(`\n🚨 Incidents with severity: ${severity}`);
      console.log(`Found: ${incidents.length}\n`);
      incidents.forEach((inc, i) => {
        console.log(`${i + 1}. ${inc.title}`);
        console.log(`   Service: ${inc.service} | Status: ${inc.status}`);
        console.log(`   Created: ${new Date(inc.createdAt).toLocaleString()}\n`);
      });
    } else {
      // Show latest 20
      const incidents = await queryDatabase();
      console.log("\n📝 Latest 20 Incidents in Database:\n");
      incidents.forEach((inc, i) => {
        console.log(`${i + 1}. ${inc.title}`);
        console.log(`   ID: ${inc.id}`);
        console.log(`   Service: ${inc.service}`);
        console.log(`   Severity: ${inc.severity} | Status: ${inc.status}`);
        console.log(`   Owner: ${inc.owner || "N/A"}`);
        console.log(`   Created: ${new Date(inc.createdAt).toLocaleString()}`);
        console.log();
      });
    }

    console.log("Commands:");
    console.log("  node check-db.js              (Show latest 20 incidents)");
    console.log("  node check-db.js stats        (Show database statistics)");
    console.log("  node check-db.js status OPEN  (Show incidents by status)");
    console.log("  node check-db.js severity SEV1 (Show incidents by severity)\n");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
