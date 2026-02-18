import { useState, useEffect } from "react";
import Filters from "../components/Filters";
import IncidentTable from "../components/IncidentTable";
import { api } from "../api/incidents";

export default function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState({
    search: "",
    severity: "",
    status: "",
    service: "",
    sortBy: "createdAt",
    order: "desc"
  });

  // Fetch incidents when filters or pagination changes
  useEffect(() => {
    fetchIncidents();
  }, [filters, pagination.page]);

  async function fetchIncidents() {
    try {
      setLoading(true);
      const response = await api.getIncidents({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      setIncidents(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      alert("Failed to load incidents");
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when filtering
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleSortChange = (sortBy, order) => {
    setFilters(prev => ({ ...prev, sortBy, order }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <>
      <Filters onFilterChange={handleFilterChange} />
      <IncidentTable
        incidents={incidents}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
      />
    </>
  );
}

