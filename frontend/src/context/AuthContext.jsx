// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [errorAuth, setErrorAuth] = useState(null);

  const login = async (correo_electronico, password) => {
    try {
      setLoadingAuth(true);
      setErrorAuth(null);

      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo_electronico, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credenciales incorrectas");

      setUser(data);
      setRoles(data.roles || []);
      return data;
    } catch (err) {
      setErrorAuth(err.message);
      return null;
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, roles, setUser, errorAuth, loadingAuth, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
