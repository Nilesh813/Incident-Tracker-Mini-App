import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const severities = ["SEV1", "SEV2", "SEV3", "SEV4"];
const statuses = ["OPEN", "MITIGATED", "RESOLVED"];

export default function Filters({ onFilterChange }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      onFilterChange({
        search: searchTerm,
        severity: selectedSeverity,
        status: selectedStatus
      });
    }, 500);

    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [searchTerm, selectedStatus, selectedSeverity]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedSeverity("");
    onFilterChange({
      search: "",
      severity: "",
      status: ""
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Severity</option>
          {severities.map(severity => (
            <option key={severity} value={severity}>{severity}</option>
          ))}
        </select>

        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Reset
        </button>

        <button
          onClick={() => navigate("/create")}
          className="ml-auto bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm font-medium"
        >
          New Incident
        </button>
      </div>
    </div>
  );
}

