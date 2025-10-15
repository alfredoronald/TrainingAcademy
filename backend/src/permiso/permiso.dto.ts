export class PermisoDto {
  id_permiso: number;
  nombre: string;
  descripcion?: string;
}

export class CreatePermisoDto {
  nombre: string;
  descripcion?: string;
}

export class UpdatePermisoDto {
  nombre?: string;
  descripcion?: string;
}
