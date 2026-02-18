# Incident Tracker Mini App - Full Stack Implementation

## Overview
A complete full-stack web application for creating, browsing, and managing production incidents with a React frontend and Node.js/Express backend.

## Features Implemented

### Backend (Node.js + Express + SQLite)
- **REST APIs with full CRUD operations**
  - POST `/api/incidents` - Create new incidents with validation
  - GET `/api/incidents` - Fetch incidents with server-side pagination, filtering, and sorting
  - GET `/api/incidents/:id` - Fetch single incident details
  - PATCH `/api/incidents/:id` - Update incident status and details

- **Database**
  - SQLite with proper schema and indexes
  - Data types: id (uuid), title, service, severity (SEV1-SEV4), status (OPEN/MITIGATED/RESOLVED), owner, summary
  - Timestamps: createdAt, updatedAt
  - Indexed columns for optimal query performance

- **Data Seeding**
  - Automatically seeds database with 200 sample incidents
  - Realistic test data with various services, severities, and statuses
  - Run `npm run seed` to regenerate

### Frontend (React + React Router + Tailwind CSS)
- **Incident List Page**
  - Paginated table with server-side pagination
  - Real-time search with debouncing (500ms)
  - Filter by Severity, Status, Service
  - Sort by Title, Severity, Status, Created Date
  - Loading states and error handling

- **Incident Detail Page**
  - View full incident information
  - Edit mode for updating incidents
  - Real-time updates to the database
  - Color-coded severity levels
  - Status indicators

- **Create Incident Page**
  - Form with validation
  - Service selection dropdown
  - Severity radio buttons
  - Status selection
  - Optional owner and summary fields

- **Components**
  - Reusable Filters component with debounced search
  - Data table with pagination controls
  - Responsive design with Tailwind CSS
  - Loading indicators and error messages

## Project Structure

```
Incident Tracker Mini App/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── IncidentList.jsx      # Main list with state management
│   │   │   ├── IncidentDetail.jsx    # Detail & edit page
│   │   │   └── CreateIncident.jsx    # Create form
│   │   ├── components/
│   │   │   ├── Filters.jsx           # Search & filter controls
│   │   │   └── IncidentTable.jsx     # Paginated data table
│   │   ├── api/
│   │   │   └── incidents.js          # API service layer
│   │   ├── data/
│   │   │   └── mockData.js           # (No longer used, kept for reference)
│   │   └── App.jsx                   # Routing setup
│   └── package.json
│
└── server/                    # Node.js Backend
    ├── server.js              # Express app & API endpoints
    ├── database.js            # SQLite setup
    ├── seed.js                # Database seeding script
    ├── package.json
    └── incidents.db           # SQLite database (generated)
```

## Installation & Setup

### Backend Setup
```bash
cd server
npm install
npm run seed          # Seeds database with 200 incidents
npm run dev           # Starts server on http://localhost:3000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev           # Starts on http://localhost:5174
```

### Access Application
- Frontend: **http://localhost:5174**
- Backend API: **http://localhost:3000/api**

## API Endpoints Documentation

### Get All Incidents
```
GET /api/incidents?page=1&limit=10&search=&severity=SEV1&status=OPEN&sortBy=createdAt&order=desc
```
**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 200,
    "pages": 20
  }
}
```

### Get Single Incident
```
GET /api/incidents/:id
```

### Create Incident
```
POST /api/incidents
Content-Type: application/json

{
  "title": "Login Failure",
  "service": "Backend",
  "severity": "SEV1",
  "status": "OPEN",
  "owner": "john@team.com",
  "summary": "Users unable to login..."
}
```

### Update Incident
```
PATCH /api/incidents/:id
Content-Type: application/json

{
  "status": "MITIGATED",
  "severity": "SEV2"
}
```

## Key Features

### Server-Side Pagination
- Configurable page size (default: 10, max: 50)
- Total incidents count and page information
- Efficient offset-based pagination with SQL LIMIT/OFFSET

### Advanced Filtering
- **Search**: Full-text search across title and summary (debounced)
- **Severity Filter**: SEV1, SEV2, SEV3, SEV4
- **Status Filter**: OPEN, MITIGATED, RESOLVED
- **Service Filter**: Multiple service types
- **Sorting**: By title, severity, status, createdAt, updatedAt
- **Order**: Ascending or Descending

### Data Validation
- Required field validation (title, service, severity, status)
- Enum validation for severity and status
- Email validation for owner field
- Parameterized queries to prevent SQL injection

### Performance Optimizations
- Database indexing on frequently queried columns
- Debounced search to reduce API calls
- Pagination to limit data transfer
- Proper HTTP status codes and error messages

## Technology Stack

**Frontend:**
- React 19.2.0
- React Router v6
- Tailwind CSS 4.1.18
- Vite 7.3.1

**Backend:**
- Express.js 4.18.2
- SQLite3 5.1.6
- Node.js with ES modules
- CORS for cross-origin requests

## Troubleshooting

**Port Already in Use:**
- Backend: Change PORT in `server/server.js`
- Frontend: Vite will auto-select another port

**Database Locked:**
- Delete `server/incidents.db` and run `npm run seed` again

**API Connection Error:**
- Ensure backend is running on `http://localhost:3000`
- Check CORS is enabled (already configured)

**Module Not Found:**
- Run `npm install` in both client and server directories

## Future Enhancements
- User authentication & authorization
- Real-time updates with WebSockets
- Incident assignment workflow
- Email notifications
- Export functionality (CSV/PDF)
- Advanced analytics dashboard
