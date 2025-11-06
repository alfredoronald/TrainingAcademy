// curso.dto.ts
export class CreateCursoDto {
  nombre_curso: string;
  descripcion?: string;
  duracion?: number;
  cupos?: number;
  costo?: number;
  modalidad?: string;
  estado_disponibilidad?: 'ACTIVO' | 'INACTIVO';
  id_docente: number;      // ID del docente
  id_tipo_curso: number;   // ID del tipo de curso
}