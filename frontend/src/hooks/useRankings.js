import { useState, useEffect } from "react";

export function useRankings() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/rankings");
        if (!res.ok) throw new Error("Error al obtener rankings");
        const data = await res.json();

        const transformed = data.map((item, index) => ({
          id: item.id_ranking,
          name: item.usuario?.nombre || "Sin nombre",
          rank: index + 1,
          courses: item.curso ? 1 : 0,
          points: item.posicion || 0,
        }));

        setRankings(transformed);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return { rankings, loading, error };
}
