import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion, EstadoInscripcion } from './inscripcion.entity';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';
import { CreateInscripcionDto } from './inscripcion.dto';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepo: Repository<Inscripcion>,

    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,

    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // Crear inscripción
  async create(dto: CreateInscripcionDto): Promise<Inscripcion> {
    const curso = await this.cursoRepo.findOne({
      where: { id_curso: dto.id_curso },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: dto.id_usuario },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const existe = await this.inscripcionRepo.findOne({
      where: { curso: curso, usuario: usuario },
    });
    if (existe)
      throw new ConflictException('El usuario ya está inscrito en este curso');

    // Crear la entidad Inscripcion usando objetos de relación
    const inscripcion = this.inscripcionRepo.create({
      curso, // objeto Curso
      usuario, // objeto Usuario
      estado: dto.estado
        ? (dto.estado as EstadoInscripcion)
        : EstadoInscripcion.ACTIVA,
      precio: dto.precio,
      precio_final: dto.precio_final,
      fecha_inscripcion: dto.fecha_inscripcion || new Date(),
    });

    return await this.inscripcionRepo.save(inscripcion);
  }

  // Obtener inscripción por id
  async findOne(id: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id_inscripcion: id },
      relations: ['curso', 'usuario'],
    });
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  // Obtener todas las inscripciones
  findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepo.find({ relations: ['curso', 'usuario'] });
  }
}
