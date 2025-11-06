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
    private readonly tipoCursoRepo: Repository<TipoCurso>,
  ) {}

  // CREAR CURSO - SOLUCIÓN DEFINITIVA
  async create(createCursoDto: CreateCursoDto): Promise<Curso> {
    console.log('Datos recibidos para crear curso:', createCursoDto);

    const { id_docente, id_tipo_curso, ...cursoData } = createCursoDto;

    // Validar docente
    const docente = await this.usuarioRepo.findOne({ 
      where: { id_usuario: id_docente } 
    });
    if (!docente) {
      throw new NotFoundException('Docente no encontrado');
    }

    // Validar tipo de curso
    const tipoCurso = await this.tipoCursoRepo.findOne({ 
      where: { id_tipo_curso } 
    });
    if (!tipoCurso) {
      throw new NotFoundException('Tipo de curso no encontrado');
    }

    // 🔥 SOLUCIÓN: Crear el curso SIN forzar ID
    // TypeORM automáticamente usará el SERIAL de PostgreSQL
    const nuevoCurso = this.cursoRepo.create({
      ...cursoData,
      id_usuario_docente: id_docente,  // Usar el nombre exacto de la columna
      id_tipo_curso: id_tipo_curso,    // Usar el nombre exacto de la columna
    });

    try {
      const cursoGuardado = await this.cursoRepo.save(nuevoCurso);
      console.log('Curso creado exitosamente con ID:', cursoGuardado.id_curso);
      return cursoGuardado;
    } catch (error) {
      console.error('Error al guardar curso:', error);
      
      // Si sigue el error de duplicado, usar query nativa
      if (error.code === '23505') {
        return await this.createWithNativeQuery(createCursoDto);
      }
      
      throw error;
    }
  }

  // Método de respaldo con query nativa
  private async createWithNativeQuery(createCursoDto: CreateCursoDto): Promise<Curso> {
    const { 
      nombre_curso, 
      descripcion, 
      duracion, 
      cupos, 
      costo, 
      modalidad, 
      estado_disponibilidad,
      id_docente, 
      id_tipo_curso 
    } = createCursoDto;

    // Query nativa que respeta el auto-increment
    const result = await this.cursoRepo.query(
      `INSERT INTO curso (
        nombre_curso, descripcion, duracion, cupos, costo, 
        modalidad, estado_disponibilidad, id_usuario_docente, id_tipo_curso
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        nombre_curso, descripcion, duracion, cupos, costo,
        modalidad, estado_disponibilidad, id_docente, id_tipo_curso
      ]
    );

    // Buscar el curso completo con relaciones
    const cursoCreado = await this.cursoRepo.findOne({
      where: { id_curso: result[0].id_curso },
      relations: ['docente', 'tipo_curso']
    });

    if (!cursoCreado) {
      throw new NotFoundException('Error al crear curso');
    }

    return cursoCreado;
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
      const docente = await this.usuarioRepo.findOne({ 
        where: { id_usuario: updateCursoDto.id_docente } 
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
      docente: curso.docente ? {
        id_usuario: curso.docente.id_usuario,
        nombre: curso.docente.nombre,
        apellido: curso.docente.apellido,
        correo_electronico: curso.docente.correo_electronico,
      } : null,
      tipo_curso: curso.tipo_curso ? {
        id_tipo_curso: curso.tipo_curso.id_tipo_curso,
        nombre_tipo_curso: curso.tipo_curso.nombre_tipo_curso,
        descripcion: curso.tipo_curso.descripcion,
      } : null,
      horarios: curso.horarios || [],
      modulos: curso.modulos || [],
    };
  }
}