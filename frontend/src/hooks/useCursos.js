import { useEffect, useState } from "react";

export function useCursos() {
  const [courses, setCourses] = useState([]);
  const [errorCursos, setErrorCursos] = useState(null);
  const [loadingCursos, setLoadingCursos] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/cursos");
        if (!res.ok) throw new Error("Error al obtener los cursos");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setErrorCursos(err.message);
      } finally {
        setLoadingCursos(false);
      }
    };

    fetchCursos();
  }, []);

  return { courses, errorCursos, loadingCursos };
}
