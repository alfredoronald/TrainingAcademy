import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './curso.entity'; // ⚠️ Aquí estaba faltando
import { EstadoDisponibilidad } from './estado.enum';
import { Usuario } from '../usuario/usuario.entity';
import { CreateCursoDto } from './curso.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // Crear curso
  async create(dto: CreateCursoDto): Promise<Curso> {
    // Buscar el usuario asociado
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: dto.id_usuario },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // Crear la entidad Curso
    const curso = this.cursoRepo.create({
      nombre_curso: dto.nombre_curso,
      descripcion: dto.descripcion,
      duracion: dto.duracion,
      modalidad: dto.modalidad,
      costo: dto.costo,
      cupos: dto.cupos,
      usuario: usuario, // entidad completa
      estado_disponibilidad: EstadoDisponibilidad.ACTIVO, // ⚠️ usa el enum
    });

    // Guardar y retornar
    return await this.cursoRepo.save(curso);
  }

  // Obtener un curso por id
  async findOne(id: number): Promise<Curso> {
    const curso = await this.cursoRepo.findOne({
      where: { id_curso: id },
      relations: ['usuario'], // traer relación con Usuario
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return curso;
  }

  // Obtener todos los cursos
  async findAll(): Promise<Curso[]> {
    return await this.cursoRepo.find({ relations: ['usuario'] });
  }
}
