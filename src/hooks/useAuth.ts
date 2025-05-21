import { User } from "@/app/services/mutation/login";
import { useState, useEffect, useCallback } from "react";

interface WithToken extends User {
  data: User;
  token: string;
}

interface UseAuthReturn {
  user: User | WithToken | null;
  loading: boolean;
  login: (user: WithToken) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching user from localStorage or API
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (user: WithToken) => {
    setLoading(true);
    setUser(user);

    const userData = user.data;

    localStorage.setItem("user", JSON.stringify(userData));
    if (user.token) {
      localStorage.setItem("token", user.token);
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return { user, loading, login, logout };
}
