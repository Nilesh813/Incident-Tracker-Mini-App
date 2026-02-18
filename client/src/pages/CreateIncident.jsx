import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/incidents";

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

export default function CreateIncident() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    service: services[0],
    severity: severities[0],
    status: statuses[0],
    owner: "",
    summary: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]); // Clear errors on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      await api.createIncident(formData);
      alert("Incident created successfully!");
      navigate("/");
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors([error.message || "Failed to create incident"]);
      }
      console.error("Error creating incident:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        ← Back to Incidents
      </button>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create New Incident</h2>
        </div>

        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <p className="text-red-800 font-medium mb-2">Validation errors:</p>
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Issue Title..."
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <div className="flex gap-2">
                  {severities.map(sev => (
                    <label key={sev} className="flex items-center">
                      <input
                        type="radio"
                        name="severity"
                        value={sev}
                        checked={formData.severity === sev}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm">{sev}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700 mb-1">
                Owner <span className="text-gray-500 text-xs">Optional</span>
              </label>
              <input
                type="email"
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Describe the incident..."
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-8 flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Incident"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
