const API_BASE = "http://localhost:3000/api";

export const api = {
  async getIncidents(params = {}) {
    const query = new URLSearchParams();
    query.append("page", params.page || 1);
    query.append("limit", params.limit || 10);
    if (params.search) query.append("search", params.search);
    if (params.severity) query.append("severity", params.severity);
    if (params.status) query.append("status", params.status);
    if (params.service) query.append("service", params.service);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.order) query.append("order", params.order);

    const response = await fetch(`${API_BASE}/incidents?${query}`);
    if (!response.ok) throw new Error("Failed to fetch incidents");
    return response.json();
  },

  async getIncident(id) {
    const response = await fetch(`${API_BASE}/incidents/${id}`);
    if (!response.ok) throw new Error("Failed to fetch incident");
    return response.json();
  },

  async createIncident(data) {
    const response = await fetch(`${API_BASE}/incidents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  },

  async updateIncident(id, data) {
    const response = await fetch(`${API_BASE}/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    return response.json();
  }
};
