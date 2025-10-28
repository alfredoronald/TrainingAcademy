import { useState, useEffect } from "react";

export function useInsignias() {
  const [insignias, setInsignias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsignias = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/insignias");
        if (!res.ok) throw new Error("Error al obtener las insignias");
        const data = await res.json();

        // Mapeamos los datos de la API al formato del front
        const transformed = data.map((item) => ({
          id: item.id_insignia,
          name: item.nombre,
          description: item.descripcion,
          criterio: item.criterio,
          points: Math.floor(Math.random() * 300) + 100, // Puntos ficticios si tu API no los tiene
        }));

        setInsignias(transformed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInsignias();
  }, []);

  return { insignias, loading, error };
}
