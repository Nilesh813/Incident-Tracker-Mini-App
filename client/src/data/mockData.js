export const mockIncidents = [
  {
    id: 1,
    title: "Login Failure",
    service: "Backend",
    severity: "SEV1",
    status: "Open",
    createdAt: "04/15/2024",
    owner: "john@team.com",
    assignedTo: "dev@team.com",
    occurredAt: "April 15, 2024",
    summary: "Users unable to login to the system since morning affecting all production users."
  },
  {
    id: 2,
    title: "Payment Delay",
    service: "Payment Service",
    severity: "SEV2",
    status: "Resolved",
    createdAt: "04/14/2024",
    owner: "jane@team.com",
    assignedTo: "dev@team.com",
    occurredAt: "April 14, 2024",
    summary: "Payment processing delayed by 2 hours causing concern among merchants."
  },
  {
    id: 3,
    title: "API Timeout",
    service: "Backend",
    severity: "SEV1",
    status: "Resolved",
    createdAt: "04/13/2024",
    owner: "mike@team.com",
    assignedTo: "dev@team.com",
    occurredAt: "April 13, 2024",
    summary: "API requests to the backend service were timing out causing disruptions."
  },
  {
    id: 4,
    title: "UI Bug on Dashboard",
    service: "Frontend",
    severity: "SEV3",
    status: "Open",
    createdAt: "04/12/2024",
    owner: "sarah@team.com",
    assignedTo: "dev@team.com",
    occurredAt: "April 12, 2024",
    summary: "Dashboard charts are not rendering properly on mobile devices."
  },
  {
    id: 5,
    title: "Database Issue",
    service: "Database",
    severity: "SEV2",
    status: "Open",
    createdAt: "04/11/2024",
    owner: "alex@team.com",
    assignedTo: "dev@team.com",
    occurredAt: "April 11, 2024",
    summary: "Database connection pool exhausted causing application to hang."
  }
];

export const services = ["Backend", "Payment Service", "Frontend", "Database", "Authentication"];
export const severities = ["SEV1", "SEV2", "SEV3", "SEV4"];
export const statuses = ["Open", "In Progress", "Resolved", "Closed"];
