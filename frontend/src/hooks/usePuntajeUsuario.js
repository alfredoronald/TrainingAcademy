import { useEffect, useState } from "react";

export function usePuntajeUsuario(idUsuario) {
  const [puntos, setPuntos] = useState(null);
  const [errorPuntos, setErrorPuntos] = useState(null);
  const [loadingPuntos, setLoadingPuntos] = useState(true);

  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/puntajes");
        if (!res.ok) throw new Error("Error al obtener datos de puntaje");

        const data = await res.json();
        const usuarioPuntaje = data.find(
          (item) => item.usuario.id_usuario === idUsuario
        );

        if (usuarioPuntaje) {
          setPuntos({
            totalObtenidos: usuarioPuntaje.total_puntos_obtenidos,
            totalUsados: usuarioPuntaje.total_puntos_usados,
            saldo: usuarioPuntaje.total_saldo_puntos,
          });
        } else {
          setErrorPuntos("No se encontró el puntaje del usuario");
        }
      } catch (err) {
        setErrorPuntos("Error al cargar el puntaje");
      } finally {
        setLoadingPuntos(false);
      }
    };

    fetchPuntos();
  }, [idUsuario]);

  return { puntos, errorPuntos, loadingPuntos };
}
