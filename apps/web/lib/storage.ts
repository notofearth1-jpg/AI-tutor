export const localKeys = {
  userId: "ai_tutor_user_id",
  role: "ai_tutor_role"
};

export function setSession(data: { userId: string; role: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem(localKeys.userId, data.userId);
    localStorage.setItem(localKeys.role, data.role);
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(localKeys.userId);
    localStorage.removeItem(localKeys.role);
  }
}

export function getUserId() {
  if (typeof window !== "undefined") return localStorage.getItem(localKeys.userId);
  return null;
}

export function getRole() {
  if (typeof window !== "undefined") return localStorage.getItem(localKeys.role);
  return null;
}
