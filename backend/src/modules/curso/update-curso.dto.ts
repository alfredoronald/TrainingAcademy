export class UpdateCursoDto {
  nombre_curso?: string;
  descripcion?: string;
  duracion?: number;
  modalidad?: string;
  costo?: number;
  cupos?: number;
  id_docente?: number; // opcional para actualizar docente
}
