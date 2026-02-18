import { BrowserRouter, Routes, Route } from "react-router-dom";
import IncidentList from "./pages/IncidentList";
import IncidentDetail from "./pages/IncidentDetail";
import CreateIncident from "./pages/CreateIncident";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Incident Tracker
          </h1>

          <Routes>
            <Route path="/" element={<IncidentList />} />
            <Route path="/incidents/:id" element={<IncidentDetail />} />
            <Route path="/create" element={<CreateIncident />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
