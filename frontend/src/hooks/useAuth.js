// src/hooks/useAuth.js
import { useState } from "react";

export function useAuth() {
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
      return data; // ✅ para que el componente que llame login reciba los datos
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

  return { user, roles, loadingAuth, errorAuth, login, logout };
}
