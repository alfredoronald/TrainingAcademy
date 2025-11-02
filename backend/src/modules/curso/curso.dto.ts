export class CreateCursoDto {
  nombre_curso: string;
  descripcion?: string;
  duracion?: number;
  modalidad?: string;
  costo?: number;
  cupos?: number;
  id_docente: number; // obligatorio para asignar el docente
}
