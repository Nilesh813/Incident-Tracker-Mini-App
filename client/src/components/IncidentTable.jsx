import { useNavigate } from "react-router-dom";

export default function IncidentTable({
  incidents = [],
  loading = false,
  pagination = {},
  onPageChange = () => {},
  onSortChange = () => {}
}) {
  const navigate = useNavigate();

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr className="text-left text-sm text-gray-700 font-semibold">
            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => onSortChange("title", "asc")}>
              Title
            </th>
            <th className="p-4">Service</th>
            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => onSortChange("severity", "asc")}>
              Severity
            </th>
            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => onSortChange("status", "asc")}>
              Status
            </th>
            <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => onSortChange("createdAt", "desc")}>
              Created At
            </th>
            <th className="p-4">Owner</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-8 text-sm">
                Loading incidents...
              </td>
            </tr>
          ) : incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <tr
                key={incident.id}
                onClick={() => navigate(`/incidents/${incident.id}`)}
                className={`border-b cursor-pointer hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="p-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                  {incident.title}
                </td>
                <td className="p-4 text-sm text-gray-600">{incident.service}</td>
                <td className="p-4 text-sm">
                  <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="p-4 text-sm">
                  <span className={`font-medium ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">{formatDate(incident.createdAt)}</td>
                <td className="p-4 text-sm text-gray-600">{incident.owner || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-gray-500 py-8 text-sm">
                No incidents found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!loading && incidents.length > 0 && (
        <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between text-sm text-gray-600">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
