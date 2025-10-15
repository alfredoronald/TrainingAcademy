export class CreateInscripcionDto {
  id_curso: number;
  id_usuario: number;
  estado?: string;
  precio: number;
  precio_final: number;
  fecha_inscripcion?: Date;
}
