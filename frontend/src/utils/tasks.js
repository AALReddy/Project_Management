import { apiFetch } from "./api";
import { getCurrentProject, getCurrentUser } from "./storage";

export async function getCurrentProjectTasks({ onlyCurrentUser = false } = {}) {
  const project = getCurrentProject();
  if (!project?._id) {
    return [];
  }

  const result = await apiFetch("/api/v2/get-all-tasks", {
    method: "POST",
    body: JSON.stringify({ project: project._id }),
  });

  const tasks = Array.isArray(result?.data) ? result.data : [];
  if (!onlyCurrentUser) {
    return tasks;
  }

  const user = getCurrentUser();
  if (!user?.id) {
    return [];
  }

  return tasks.filter((task) => {
    const assignedId =
      typeof task.assignedTo === "object" ? task.assignedTo?._id : task.assignedTo;
    return assignedId === user.id;
  });
}
