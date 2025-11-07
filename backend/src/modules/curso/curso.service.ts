import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './curso.entity';
import { CreateCursoDto } from './curso.dto';
import { UpdateCursoDto } from './update-curso.dto';
import { Usuario } from '../usuario/usuario.entity';
import { TipoCurso } from '../tipo-curso/tipo-curso.entity';

@Injectable()
export class CursoService {
  constructor(
  @InjectRepository(Curso)
  private readonly cursoRepo: Repository<Curso>,

  @InjectRepository(Usuario)
  private readonly usuarioRepo: Repository<Usuario>,

  @InjectRepository(TipoCurso)
  private readonly tipoCursoRepo: Repository<TipoCurso>, // 👈 agregado
) {}


  // Crear curso
 async create(createCursoDto: CreateCursoDto): Promise<Curso> {
  console.log('Datos recibidos para crear curso:', createCursoDto);

  // 🚫 Evita usar un id_curso manual (PostgreSQL lo genera solo)
  delete (createCursoDto as any).id_curso;

  const { id_docente, id_tipo_curso, ...cursoData } = createCursoDto;

  const docente = await this.usuarioRepo.findOne({ where: { id_usuario: id_docente } });
  if (!docente) throw new NotFoundException('Docente no encontrado');

  // 🔹 Si no se envía tipo de curso, crear uno por defecto
  let tipoCurso;
  if (id_tipo_curso) {
    tipoCurso = await this.tipoCursoRepo.findOne({ where: { id_tipo_curso } });
    if (!tipoCurso) throw new NotFoundException('Tipo de curso no encontrado');
  } else {
    tipoCurso = this.tipoCursoRepo.create({
      nombre_tipo_curso: 'General',
      descripcion: 'Tipo de curso generado automáticamente',
    });
    await this.tipoCursoRepo.save(tipoCurso);
  }

  // 🔹 Crear el curso con las relaciones correctas
  const nuevoCurso = this.cursoRepo.create({
    ...cursoData,
    docente,
    tipo_curso: tipoCurso,
  });

  const cursoGuardado = await this.cursoRepo.save(nuevoCurso);
  return cursoGuardado;
}



  // Obtener todos los cursos
  async findAll(): Promise<any[]> {
    const cursos = await this.cursoRepo.find({
      relations: ['docente', 'horarios', 'modulos', 'tipo_curso'],
    });
    return cursos.map(c => this.formatCurso(c));
  }

  // Obtener curso por ID
  async findOne(id_curso: number): Promise<any> {
    const curso = await this.cursoRepo.findOne({
      where: { id_curso },
      relations: ['docente', 'horarios', 'modulos', 'tipo_curso'],
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return this.formatCurso(curso);
  }

  // Actualizar curso
  async update(id_curso: number, updateCursoDto: UpdateCursoDto): Promise<any> {
    const curso = await this.cursoRepo.findOne({
      where: { id_curso },
      relations: ['docente', 'horarios', 'modulos', 'tipo_curso'],
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    if (updateCursoDto.id_docente) {
      const docente = await this.usuarioRepo.findOne({ where: { id_usuario: updateCursoDto.id_docente } });
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
  private formatCurso(curso: Curso): any {
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
      tipo_curso: curso.tipo_curso
        ? {
            id_tipo_curso: curso.tipo_curso.id_tipo_curso,
            nombre_tipo_curso: curso.tipo_curso.nombre_tipo_curso,
            descripcion: curso.tipo_curso.descripcion,
          }
        : null,
      horarios: curso.horarios || [],
      modulos: curso.modulos || [],
    };
  }
}
