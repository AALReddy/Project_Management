export function getStoredJSON(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

export function setStoredJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentUser() {
  return getStoredJSON("user", null);
}

export function getProjects() {
  const projects = getStoredJSON("project", []);
  return Array.isArray(projects) ? projects : [];
}

export function getCurrentProject() {
  return getProjects()[0] || null;
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("project");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
}
