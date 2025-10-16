export class CreateTipoCursoDto {
  nombre_tipo_curso: string;
  descripcion?: string;
  id_curso: number; // ⚠️ id del curso al que pertenece
}
