import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCurso } from './tipo-curso.entity';
import { Curso } from '../curso/curso.entity';
import { CreateTipoCursoDto } from './tipo-curso.dto';

@Injectable()
export class TipoCursoService {
  constructor(
    @InjectRepository(TipoCurso)
    private readonly tipoCursoRepo: Repository<TipoCurso>,
    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
  ) {}

  async create(dto: CreateTipoCursoDto): Promise<TipoCurso> {
    // Buscar el curso relacionado
    const curso = await this.cursoRepo.findOne({
      where: { id_curso: dto.id_curso },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    // Crear la entidad TipoCurso
    const tipoCurso = this.tipoCursoRepo.create({
      nombre_tipo_curso: dto.nombre_tipo_curso,
      descripcion: dto.descripcion,
      curso: curso, // ⚠️ asignar la entidad completa, no solo el id
    });

    return this.tipoCursoRepo.save(tipoCurso);
  }

  findAll(): Promise<TipoCurso[]> {
    return this.tipoCursoRepo.find({ relations: ['curso'] });
  }

  async findOne(id: number): Promise<TipoCurso> {
    const tipoCurso = await this.tipoCursoRepo.findOne({
      where: { id_tipo_curso: id },
      relations: ['curso'],
    });
    if (!tipoCurso) throw new NotFoundException('Tipo de curso no encontrado');
    return tipoCurso;
  }
}
