import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { db, initializeDatabase, runAsync, getAsync, allAsync } from "./database.js";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initializeDatabase();

// Validation middleware
function validateIncident(data) {
  const errors = [];

  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required");
  }

  if (!data.service) {
    errors.push("Service is required");
  }

  if (!["SEV1", "SEV2", "SEV3", "SEV4"].includes(data.severity)) {
    errors.push("Invalid severity");
  }

  if (!["OPEN", "MITIGATED", "RESOLVED"].includes(data.status)) {
    errors.push("Invalid status");
  }

  return errors;
}

// GET /api/incidents - Fetch incidents with pagination, filtering, sorting
app.get("/api/incidents", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const severity = req.query.severity || "";
    const status = req.query.status || "";
    const service = req.query.service || "";
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? "ASC" : "DESC";

    // Build WHERE clause
    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push("(title LIKE ? OR summary LIKE ?)");
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (severity) {
      whereConditions.push("severity = ?");
      params.push(severity);
    }

    if (status) {
      whereConditions.push("status = ?");
      params.push(status);
    }

    if (service) {
      whereConditions.push("service = ?");
      params.push(service);
    }

    const whereClause = whereConditions.length > 0 ? "WHERE " + whereConditions.join(" AND ") : "";

    // Validate sort column to prevent SQL injection
    const validSortColumns = ["createdAt", "updatedAt", "severity", "status", "title"];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : "createdAt";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM incidents ${whereClause}`;
    const countResult = await getAsync(countQuery, params);
    const total = countResult.total;

    // Get paginated results
    const query = `
      SELECT * FROM incidents 
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT ? OFFSET ?
    `;

    const incidents = await allAsync(query, [...params, limit, offset]);

    res.json({
      data: incidents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// GET /api/incidents/:id - Fetch single incident
app.get("/api/incidents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM incidents WHERE id = ?";
    const incident = await getAsync(query, [id]);

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json(incident);
  } catch (error) {
    console.error("Error fetching incident:", error);
    res.status(500).json({ error: "Failed to fetch incident" });
  }
});

// POST /api/incidents - Create new incident
app.post("/api/incidents", async (req, res) => {
  try {
    const { title, service, severity, status, owner, summary } = req.body;

    // Validate
    const errors = validateIncident({ title, service, severity, status });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    const query = `
      INSERT INTO incidents (id, title, service, severity, status, owner, summary, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await runAsync(query, [
      id,
      title,
      service,
      severity,
      status || "OPEN",
      owner || null,
      summary || null,
      now,
      now
    ]);

    const newIncident = await getAsync("SELECT * FROM incidents WHERE id = ?", [id]);
    res.status(201).json(newIncident);
  } catch (error) {
    console.error("Error creating incident:", error);
    res.status(500).json({ error: "Failed to create incident" });
  }
});

// PATCH /api/incidents/:id - Update incident
app.patch("/api/incidents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, service, severity, status, owner, summary } = req.body;

    // Check if incident exists
    const existing = await getAsync("SELECT * FROM incidents WHERE id = ?", [id]);
    if (!existing) {
      return res.status(404).json({ error: "Incident not found" });
    }

    // Validate if provided
    const updateData = {
      title: title !== undefined ? title : existing.title,
      service: service !== undefined ? service : existing.service,
      severity: severity !== undefined ? severity : existing.severity,
      status: status !== undefined ? status : existing.status
    };

    const errors = validateIncident(updateData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const now = new Date().toISOString();

    const updateFields = [];
    const values = [];

    if (title !== undefined) {
      updateFields.push("title = ?");
      values.push(title);
    }
    if (service !== undefined) {
      updateFields.push("service = ?");
      values.push(service);
    }
    if (severity !== undefined) {
      updateFields.push("severity = ?");
      values.push(severity);
    }
    if (status !== undefined) {
      updateFields.push("status = ?");
      values.push(status);
    }
    if (owner !== undefined) {
      updateFields.push("owner = ?");
      values.push(owner);
    }
    if (summary !== undefined) {
      updateFields.push("summary = ?");
      values.push(summary);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    updateFields.push("updatedAt = ?");
    values.push(now);
    values.push(id);

    const query = `UPDATE incidents SET ${updateFields.join(", ")} WHERE id = ?`;
    await runAsync(query, values);

    const updated = await getAsync("SELECT * FROM incidents WHERE id = ?", [id]);
    res.json(updated);
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ error: "Failed to update incident" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Debug endpoint - Show database stats
app.get("/debug/stats", async (req, res) => {
  try {
    const countResult = await getAsync("SELECT COUNT(*) as total FROM incidents");
    const allStatuses = await allAsync(
      "SELECT status, COUNT(*) as count FROM incidents GROUP BY status"
    );
    const allSeverities = await allAsync(
      "SELECT severity, COUNT(*) as count FROM incidents GROUP BY severity"
    );
    const latest = await allAsync(
      "SELECT * FROM incidents ORDER BY createdAt DESC LIMIT 5"
    );

    res.json({
      total: countResult.total,
      statusBreakdown: allStatuses.reduce((acc, item) => {
        acc[item.status] = item.count;
        return acc;
      }, {}),
      severityBreakdown: allSeverities.reduce((acc, item) => {
        acc[item.severity] = item.count;
        return acc;
      }, {}),
      latest5: latest
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API ready at http://localhost:${PORT}/api/incidents`);
});
