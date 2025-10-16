export class CreateCursoDto {
  id_usuario: number;
  nombre_curso: string;
  descripcion?: string;
  estado_disponibilidad?: 'ACTIVO' | 'INACTIVO';
  duracion?: number;
  modalidad?: string;
  costo?: number;
  cupos?: number;
}
