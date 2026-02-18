import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/incidents";

const statuses = ["OPEN", "MITIGATED", "RESOLVED"];
const severities = ["SEV1", "SEV2", "SEV3", "SEV4"];

export default function IncidentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIncident();
  }, [id]);

  async function fetchIncident() {
    try {
      setLoading(true);
      const data = await api.getIncident(id);
      setIncident(data);
      setFormData(data);
    } catch (err) {
      setError("Failed to load incident");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updated = await api.updateIncident(id, {
        title: formData.title,
        service: formData.service,
        severity: formData.severity,
        status: formData.status,
        owner: formData.owner,
        summary: formData.summary
      });
      setIncident(updated);
      setIsEditing(false);
      alert("Changes saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "SEV1":
        return "bg-red-100 text-red-800";
      case "SEV2":
        return "bg-orange-100 text-orange-800";
      case "SEV3":
        return "bg-yellow-100 text-yellow-800";
      case "SEV4":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "text-red-600";
      case "MITIGATED":
        return "text-yellow-600";
      case "RESOLVED":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading incident...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!incident) {
    return <div className="text-center py-8">Incident not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        ← Back to Incidents
      </button>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{formData.title}</h2>
              <p className="text-sm text-gray-500 mt-1">ID: {formData.id}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Service</label>
            {isEditing ? (
              <input
                type="text"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900 font-medium">{formData.service}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Severity</label>
            {isEditing ? (
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {severities.map(sev => (
                  <option key={sev} value={sev}>{sev}</option>
                ))}
              </select>
            ) : (
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getSeverityColor(formData.severity)}`}>
                {formData.severity}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Status</label>
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            ) : (
              <p className={`font-medium ${getStatusColor(formData.status)}`}>{formData.status}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Owner</label>
            {isEditing ? (
              <input
                type="email"
                name="owner"
                value={formData.owner || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.owner || "-"}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600 block mb-1">Summary</label>
            {isEditing ? (
              <textarea
                name="summary"
                value={formData.summary || ""}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.summary || "-"}</p>
            )}
          </div>

          <div className="col-span-2 text-sm text-gray-500">
            <p>Created: {new Date(formData.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(formData.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {isEditing && (
          <div className="p-6 bg-gray-50 border-t flex gap-3 justify-end">
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData(incident);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
