import { useState, useEffect } from "react";
import { api } from "../lib/api.client";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await api.post("/auth/login", { email, password: pass });
    setUser(res.data);
    return res.data;
  };

  const signup = async (email: string, pass: string) => {
    const res = await api.post("/auth/signup", { email, password: pass, role: "student" });
    // Automatically log in after signup
    return login(email, pass);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return { user, loading, login, signup, logout, checkUser };
}
