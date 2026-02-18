import { v4 as uuidv4 } from "uuid";
import { db, initializeDatabase, runAsync, allAsync } from "./database.js";

const services = [
  "Backend",
  "Frontend",
  "Payment Service",
  "Authentication",
  "Database",
  "Analytics",
  "Email Service",
  "API Gateway",
  "Cache Layer",
  "Message Queue"
];

const severities = ["SEV1", "SEV2", "SEV3", "SEV4"];
const statuses = ["OPEN", "MITIGATED", "RESOLVED"];
const owners = [
  "john@team.com",
  "jane@team.com",
  "mike@team.com",
  "sarah@team.com",
  "alex@team.com",
  "emma@team.com",
  "david@team.com",
  "lisa@team.com"
];

const incidentTitles = [
  "Login Failure",
  "Payment Delay",
  "API Timeout",
  "UI Bug on Dashboard",
  "Database Connection Issue",
  "Cache Miss Rate High",
  "Email Delivery Failed",
  "Memory Leak Detected",
  "Slow Query Performance",
  "SSL Certificate Expiry",
  "Rate Limiting Active",
  "Data Inconsistency",
  "Service Unavailable",
  "Authentication Token Expired",
  "Disk Space Critical"
];

function generateRandomDate(daysAgo = 90) {
  const date = new Date();
  date.setDate(date.getDate() - Math.random() * daysAgo);
  return date.toISOString();
}

async function seedDatabase() {
  try {
    await initializeDatabase();

    // Clear existing data
    await runAsync("DELETE FROM incidents;");

    console.log("Seeding database with 200 incidents...");

    // Insert in batches to avoid callback hell
    for (let i = 0; i < 200; i++) {
      const id = uuidv4();
      const title = `${incidentTitles[Math.floor(Math.random() * incidentTitles.length)]} #${i + 1}`;
      const service = services[Math.floor(Math.random() * services.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const summary = `This is a critical incident affecting ${service} service. Immediate action required.`;
      const createdAt = generateRandomDate();
      const updatedAt = new Date().toISOString();

      await runAsync(
        `INSERT INTO incidents (id, title, service, severity, status, owner, summary, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, title, service, severity, status, owner, summary, createdAt, updatedAt]
      );

      if ((i + 1) % 20 === 0) {
        console.log(`  Seeded ${i + 1}/200 incidents...`);
      }
    }

    console.log("✅ Seeded 200 incidents successfully!");
    console.log("✅ Run 'npm run dev' to start the server");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
