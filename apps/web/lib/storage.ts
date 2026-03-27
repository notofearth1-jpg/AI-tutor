export const localKeys = {
  userId: "ai_tutor_user_id",
  role: "ai_tutor_role",
  token: "ai_tutor_token"
};

export function setSession(data: { userId: string; role: string; accessToken?: string }) {
  if (typeof window !== "undefined") {
    localStorage.setItem(localKeys.userId, data.userId);
    localStorage.setItem(localKeys.role, data.role);
    if (data.accessToken) localStorage.setItem(localKeys.token, data.accessToken);
  }
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(localKeys.userId);
    localStorage.removeItem(localKeys.role);
    localStorage.removeItem(localKeys.token);
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

export function getAccessToken() {
  if (typeof window !== "undefined") return localStorage.getItem(localKeys.token);
  return null;
}
