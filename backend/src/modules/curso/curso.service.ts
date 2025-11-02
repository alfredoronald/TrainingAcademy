import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './curso.entity';
import { CreateCursoDto } from './curso.dto';
import { UpdateCursoDto } from './update-curso.dto';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso) 
    private readonly cursoRepo: Repository<Curso>,

    @InjectRepository(Usuario) 
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}
  


  // Crear curso
  async create(createCursoDto: CreateCursoDto): Promise<any> {
    const docente = await this.usuarioRepo.findOne({
      where: { id_usuario: createCursoDto.id_docente },
    });
    if (!docente) throw new NotFoundException('Docente no encontrado');

    const curso = this.cursoRepo.create({ ...createCursoDto, docente });
    const savedCurso = await this.cursoRepo.save(curso);
    return this.formatCurso(savedCurso);
  }

  // Obtener todos los cursos
  async findAll(): Promise<any[]> {
    const cursos = await this.cursoRepo.find({
      relations: ['docente', 'horarios', 'modulos'],
    });
    return cursos.map(c => this.formatCurso(c));
  }

  // Obtener curso por ID
  async findOne(id_curso: number): Promise<any> {
    const curso = await this.cursoRepo.findOne({
      where: { id_curso },
      relations: ['docente', 'horarios', 'modulos'],
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return this.formatCurso(curso);
  }

  // Actualizar curso
  async update(id_curso: number, updateCursoDto: UpdateCursoDto): Promise<any> {
    const curso = await this.cursoRepo.findOne({
      where: { id_curso },
      relations: ['docente', 'horarios', 'modulos'],
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    if (updateCursoDto.id_docente) {
      const docente = await this.usuarioRepo.findOne({
        where: { id_usuario: updateCursoDto.id_docente },
      });
      if (!docente) throw new NotFoundException('Docente no encontrado');
      curso.docente = docente;
    }

    Object.assign(curso, updateCursoDto);
    const updatedCurso = await this.cursoRepo.save(curso);
    return this.formatCurso(updatedCurso);
  }

  // Eliminar curso
  async remove(id_curso: number): Promise<void> {
    const curso = await this.cursoRepo.findOne({ where: { id_curso } });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    await this.cursoRepo.remove(curso);
  }

  // Formatear JSON para devolver solo campos necesarios
  private formatCurso(curso: Curso) {
    return {
      id_curso: curso.id_curso,
      nombre_curso: curso.nombre_curso,
      descripcion: curso.descripcion,
      estado_disponibilidad: curso.estado_disponibilidad,
      duracion: curso.duracion,
      modalidad: curso.modalidad,
      costo: curso.costo,
      cupos: curso.cupos,
      docente: curso.docente
        ? {
            id_usuario: curso.docente.id_usuario,
            nombre: curso.docente.nombre,
            apellido: curso.docente.apellido,
            correo_electronico: curso.docente.correo_electronico,
          }
        : null,
      horarios: curso.horarios || [],
      modulos: curso.modulos || [],
    };
  }
}
