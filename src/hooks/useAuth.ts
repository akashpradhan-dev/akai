import { User } from "@/app/services/mutation/login";
import { useState, useEffect, useCallback } from "react";

interface WithToken extends User {
  data: User;
  token: string;
}

interface UseAuthReturn {
  user: User | WithToken | null;
  token: string | null;
  loading: boolean;
  login: (user: WithToken) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching user from localStorage or API
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      const parsedToken = storedToken;
      setUser({ ...parsedUser });
      setToken(parsedToken);
    }
    setLoading(false);
  }, []);

  const login = async (user: WithToken) => {
    setLoading(true);

    const userData = user.data;
    const token = user.token;

    // Save plain user and token
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser({ ...userData });
    setToken(token);
    setLoading(false);
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return { user, token, loading, login, logout };
}
