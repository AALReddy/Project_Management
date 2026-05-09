export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8800";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data;
}

// Project API calls
export const projectAPI = {
  createProject: (projectData) =>
    apiFetch("/api/v4/create-project", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  getProjects: () =>
    apiFetch("/api/v4/get-projects", { method: "GET" }),

  getProjectById: (projectId) =>
    apiFetch(`/api/v4/get-project/${projectId}`, { method: "GET" }),

  addMembers: (projectId, memberIds) =>
    apiFetch("/api/v4/add-members", {
      method: "PUT",
      body: JSON.stringify({ projectId, memberIds }),
    }),

  removeMembers: (projectId, memberIds) =>
    apiFetch("/api/v4/remove-members", {
      method: "PUT",
      body: JSON.stringify({ projectId, memberIds }),
    }),

  updateProject: (projectId, updateData) =>
    apiFetch("/api/v4/update-project", {
      method: "PUT",
      body: JSON.stringify({ projectId, ...updateData }),
    }),

  getTeamPerformance: (projectId) =>
    apiFetch(`/api/v4/team-performance/${projectId}`, { method: "GET" }),

  deleteProject: (projectId) =>
    apiFetch("/api/v4/delete-project", {
      method: "DELETE",
      body: JSON.stringify({ projectId }),
    }),
};

// Task API calls
export const taskAPI = {
  createTask: (taskData) =>
    apiFetch("/api/v2/create-task", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),

  getProjectTasks: (projectId) =>
    apiFetch(`/api/v2/get-project-tasks/${projectId}`, { method: "GET" }),

  getMyTasks: () =>
    apiFetch("/api/v2/get-my-tasks", { method: "GET" }),

  getTasksByStatus: (projectId, status) =>
    apiFetch(`/api/v2/get-tasks-by-status/${projectId}/${status}`, {
      method: "GET",
    }),

  getOverdueTasks: (projectId) =>
    apiFetch(`/api/v2/get-overdue-tasks/${projectId}`, { method: "GET" }),

  updateTaskStatus: (taskId, status) =>
    apiFetch("/api/v2/update-task-status", {
      method: "PUT",
      body: JSON.stringify({ taskId, status }),
    }),

  updateTask: (taskId, updateData) =>
    apiFetch("/api/v2/update-task", {
      method: "PUT",
      body: JSON.stringify({ taskId, ...updateData }),
    }),

  toggleTaskImportance: (taskId) =>
    apiFetch("/api/v2/toggle-importance", {
      method: "PUT",
      body: JSON.stringify({ taskId }),
    }),

  deleteTask: (taskId) =>
    apiFetch("/api/v2/delete-task", {
      method: "DELETE",
      body: JSON.stringify({ taskId }),
    }),

  getDashboardStats: (projectId) =>
    apiFetch(`/api/v2/get-dashboard-stats/${projectId}`, { method: "GET" }),

  getAllTasks: (projectId) =>
    apiFetch("/api/v2/get-all-tasks", {
      method: "POST",
      body: JSON.stringify({ project: projectId }),
    }),
};

// Admin API calls
export const adminAPI = {
  getAllUsers: () =>
    apiFetch("/api/v3/get-all-users", { method: "GET" }),

  createUser: (userData) =>
    apiFetch("/api/v3/create-user", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  updateUserRole: (userId, role) =>
    apiFetch("/api/v3/update-user-role", {
      method: "PUT",
      body: JSON.stringify({ userId, role }),
    }),

  deleteUser: (userId) =>
    apiFetch("/api/v3/delete-user", {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    }),

  getDashboardStats: () =>
    apiFetch("/api/v3/dashboard-stats", { method: "GET" }),
};
