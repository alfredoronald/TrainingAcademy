import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { Curso } from '../curso/curso.entity';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion) 
    private inscripcionRepo: Repository<Inscripcion>,
    private dataSource: DataSource
  ) {}

  // ✅ CREAR INSCRIPCIÓN COMPLETA CON PAGO Y PROGRESO
  async crearInscripcionCompleta(data: {
    id_curso: number;
    id_usuario: number;
    metodo_pago?: string;
  }) {
    try {
      console.log('🎯 Iniciando creación de inscripción:', data);

      // 1. Verificar que el curso existe
      const curso = await this.dataSource.query(
        'SELECT * FROM curso WHERE id_curso = $1',
        [data.id_curso]
      );

      if (!curso || curso.length === 0) {
        throw new BadRequestException(`Curso con ID ${data.id_curso} no encontrado`);
      }

      // 2. Verificar que el usuario existe
      const usuario = await this.dataSource.query(
        'SELECT * FROM usuario WHERE id_usuario = $1',
        [data.id_usuario]
      );

      if (!usuario || usuario.length === 0) {
        throw new BadRequestException(`Usuario con ID ${data.id_usuario} no encontrado`);
      }

      // 3. Verificar si ya está inscrito
      const inscripcionExistente = await this.dataSource.query(
        'SELECT * FROM inscripcion WHERE id_curso = $1 AND id_usuario = $2',
        [data.id_curso, data.id_usuario]
      );

      if (inscripcionExistente && inscripcionExistente.length > 0) {
        throw new BadRequestException('El usuario ya está inscrito en este curso');
      }

      // 4. Obtener próximo ID de inscripción
      const maxIdResult = await this.dataSource.query(
        'SELECT COALESCE(MAX(id_inscripcion), 0) + 1 as next_id FROM inscripcion'
      );
      const nextId = maxIdResult[0].next_id;

      // 5. Crear inscripción
      const costoCurso = parseFloat(curso[0].costo) || 0;
      
      await this.dataSource.query(
        `INSERT INTO inscripcion (id_inscripcion, id_curso, id_usuario, estado, precio, precio_final, fecha_inscripcion)
         VALUES ($1, $2, $3, 'ACTIVA', $4, $5, CURRENT_DATE)`,
        [nextId, data.id_curso, data.id_usuario, costoCurso, costoCurso]
      );

      console.log('✅ Inscripción creada con ID:', nextId);

      // 6. Crear pago (si se proporciona método de pago)
      if (data.metodo_pago) {
        const metodosValidos = ['TARJETA', 'TRANSFERENCIA', 'BILLETERA'];
        if (!metodosValidos.includes(data.metodo_pago)) {
          throw new BadRequestException('Método de pago no válido');
        }

        const maxIdPago = await this.dataSource.query(
          'SELECT COALESCE(MAX(id_pago), 0) + 1 as next_id FROM pago'
        );

        await this.dataSource.query(
          `INSERT INTO pago (id_pago, id_inscripcion, monto, metodo_pago, descuento_aplicado, fecha_pago)
           VALUES ($1, $2, $3, $4, 0, CURRENT_DATE)`,
          [maxIdPago[0].next_id, nextId, costoCurso, data.metodo_pago]
        );
        console.log('✅ Pago registrado');
      }

      // 7. Crear progreso inicial del curso
      const maxIdProgreso = await this.dataSource.query(
        'SELECT COALESCE(MAX(id_progreso_curso), 0) + 1 as next_id FROM progreso_curso'
      );

      await this.dataSource.query(
        `INSERT INTO progreso_curso (id_progreso_curso, id_curso, id_usuario, estado_curso, porcentaje_avance)
         VALUES ($1, $2, $3, 'EN_PROGRESO', 0)`,
        [maxIdProgreso[0].next_id, data.id_curso, data.id_usuario]
      );
      console.log('✅ Progreso inicial creado');

      // 8. Retornar inscripción completa
      return await this.findOne(nextId);

    } catch (error) {
      console.error('❌ Error en creación de inscripción:', error);
      throw error;
    }
  }

  // ✅ OBTENER INSCRIPCIONES CON PROGRESO
  async obtenerInscripcionesConProgreso(idUsuario: number) {
    const inscripciones = await this.dataSource.query(
      `SELECT 
        i.id_inscripcion,
        i.id_usuario,
        i.id_curso,
        i.estado,
        i.precio,
        i.precio_final,
        i.fecha_inscripcion,
        c.nombre_curso,
        c.descripcion,
        c.duracion,
        c.modalidad,
        c.costo,
        tc.nombre_tipo_curso,
        COALESCE(pc.porcentaje_avance, 0) as progreso,
        COALESCE(pc.estado_curso, 'EN_PROGRESO') as estado_curso,
        pc.fecha_actualizacion
      FROM inscripcion i
      JOIN curso c ON i.id_curso = c.id_curso
      LEFT JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
      LEFT JOIN progreso_curso pc ON pc.id_curso = c.id_curso AND pc.id_usuario = i.id_usuario
      WHERE i.id_usuario = $1`,
      [idUsuario]
    );

    return inscripciones.map(insc => ({
      id_inscripcion: insc.id_inscripcion,
      id_usuario: insc.id_usuario,
      id_curso: insc.id_curso,
      estado: insc.estado,
      precio: parseFloat(insc.precio),
      precio_final: parseFloat(insc.precio_final),
      fecha_inscripcion: insc.fecha_inscripcion,
      progreso: parseFloat(insc.progreso) || 0,
      estado_curso: insc.estado_curso || 'EN_PROGRESO',
      completado: parseFloat(insc.progreso) === 100,
      fecha_ultima_actualizacion: insc.fecha_actualizacion,
      curso: {
        id_curso: insc.id_curso,
        nombre_curso: insc.nombre_curso,
        descripcion: insc.descripcion,
        duracion: insc.duracion,
        modalidad: insc.modalidad,
        costo: parseFloat(insc.costo),
        tipo_curso: {
          nombre_tipo_curso: insc.nombre_tipo_curso
        }
      }
    }));
  }

  // ✅ OBTENER PROGRESO ESPECÍFICO DE UN CURSO
  async obtenerProgresoCurso(idUsuario: number, idCurso: number) {
    const resultado = await this.dataSource.query(
      `SELECT porcentaje_avance, estado_curso, fecha_actualizacion
       FROM progreso_curso
       WHERE id_usuario = $1 AND id_curso = $2`,
      [idUsuario, idCurso]
    );

    if (!resultado || resultado.length === 0) {
      return {
        porcentaje_avance: 0,
        estado_curso: 'EN_PROGRESO',
        fecha_actualizacion: null
      };
    }

    return resultado[0];
  }

  // ✅ ACTUALIZAR PROGRESO
  async actualizarProgreso(idUsuario: number, idCurso: number, porcentajeAvance: number) {
    if (porcentajeAvance < 0 || porcentajeAvance > 100) {
      throw new BadRequestException('El porcentaje debe estar entre 0 y 100');
    }

    const estadoCurso = porcentajeAvance === 100 ? 'COMPLETADO' : 'EN_PROGRESO';

    await this.dataSource.query(
      `UPDATE progreso_curso
       SET porcentaje_avance = $1, 
           estado_curso = $2,
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_usuario = $3 AND id_curso = $4`,
      [porcentajeAvance, estadoCurso, idUsuario, idCurso]
    );

    return this.obtenerProgresoCurso(idUsuario, idCurso);
  }

  // Métodos básicos
  async findAll() {
    return this.inscripcionRepo.find({
      relations: ['curso', 'usuario']
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { id_inscripcion: id },
      relations: ['curso', 'curso.tipo_curso', 'usuario']
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return inscripcion;
  }

  async update(id: number, data: Partial<Inscripcion>) {
    await this.inscripcionRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.inscripcionRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }
    return { message: 'Inscripción eliminada correctamente' };
  }
}
