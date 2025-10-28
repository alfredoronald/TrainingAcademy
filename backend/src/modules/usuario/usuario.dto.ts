export class CreateUsuarioDto {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  password: string;
  rol: 'student' | 'teacher';
}
