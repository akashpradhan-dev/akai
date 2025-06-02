import { useState, useEffect, useCallback } from "react";

// interface WithToken extends User {
//   data: User;
//   token: string;
// }

// interface UseAuthReturn {
//   user: User | WithToken | null;
//   token: string | null;
//   loading: boolean;
//   login: (user: WithToken) => Promise<void>;
//   logout: () => void;
// }

interface User {
  id?: string;
  email: string;
  name: string;
}

interface LoginParams {
  user: User;
  token: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

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

  const login = async ({ user, token }: LoginParams) => {
    setLoading(true);

    // Save plain user and token
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    setUser(user);
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
