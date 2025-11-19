import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion) 
    private inscripcionRepo: Repository<Inscripcion>,
    private dataSource: DataSource
  ) {}

  // ✅ CREAR INSCRIPCIÓN COMPLETA CON PAGO, PROGRESO Y CANJE
  async crearInscripcionCompleta(data: {
  id_curso: number;
  id_usuario: number;
  metodo_pago?: string;
  id_canje?: number;
}) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    console.log('🎯 Iniciando creación de inscripción:', data);

    // 1. Verificar que el curso existe y está activo
    const curso = await queryRunner.query(
      'SELECT * FROM curso WHERE id_curso = $1 AND estado_disponibilidad = $2',
      [data.id_curso, 'ACTIVO']
    );

    if (!curso || curso.length === 0) {
      throw new BadRequestException(`Curso con ID ${data.id_curso} no encontrado o no disponible`);
    }

    // 2. Verificar que el usuario existe
    const usuario = await queryRunner.query(
      'SELECT * FROM usuario WHERE id_usuario = $1',
      [data.id_usuario]
    );

    if (!usuario || usuario.length === 0) {
      throw new BadRequestException(`Usuario con ID ${data.id_usuario} no encontrado`);
    }

    // 🆕 3. VERIFICAR INSCRIPCIÓN EXISTENTE ANTES DE PROCESAR CANJE
    const inscripcionExistente = await queryRunner.query(
      'SELECT * FROM inscripcion WHERE id_curso = $1 AND id_usuario = $2 AND estado = $3',
      [data.id_curso, data.id_usuario, 'ACTIVA']
    );

    if (inscripcionExistente && inscripcionExistente.length > 0) {
      throw new BadRequestException('El usuario ya está inscrito en este curso');
    }

    let precioFinal = parseFloat(curso[0].costo) || 0;
    let canjeUtilizado: any = null;
    let descuentoAplicado = 0;

    // 🆕 4. VALIDAR Y APLICAR CANJE SI EXISTE (SOLO si no hay inscripción existente)
    if (data.id_canje) {
      console.log('🔍 Validando canje:', data.id_canje);
      
      const canje = await queryRunner.query(
        `SELECT c.*, r.criterio, r.nombre as nombre_recompensa
         FROM canje c 
         JOIN recompensa r ON c.id_recompensa = r.id_recompensa 
         WHERE c.id_canje = $1 AND c.id_usuario = $2 AND c.utilizado = $3`,
        [data.id_canje, data.id_usuario, false]
      );

      if (canje && canje.length > 0) {
        console.log('✅ Canje válido encontrado:', canje[0].nombre_recompensa);
        
        // Aplicar descuento según el criterio de la recompensa
        descuentoAplicado = (precioFinal * canje[0].criterio) / 100;
        precioFinal = Math.max(0, precioFinal - descuentoAplicado);
        
        // Marcar canje como utilizado
        await queryRunner.query(
          'UPDATE canje SET utilizado = true, fecha_uso = CURRENT_TIMESTAMP WHERE id_canje = $1',
          [data.id_canje]
        );
        
        canjeUtilizado = {
          id_canje: canje[0].id_canje,
          nombre_recompensa: canje[0].nombre_recompensa,
          criterio: canje[0].criterio,
          descuento_aplicado: descuentoAplicado
        };

        console.log(`💰 Descuento aplicado: ${canje[0].criterio}% (-$${descuentoAplicado})`);
        console.log(`🎯 Precio final: $${precioFinal}`);
      } else {
        console.log('❌ Canje no válido o ya utilizado');
        // No retornamos error, simplemente continuamos sin descuento
      }
    }

    // 5. Obtener próximo ID de inscripción
    const maxIdResult = await queryRunner.query(
      'SELECT COALESCE(MAX(id_inscripcion), 0) + 1 as next_id FROM inscripcion'
    );
    const nextId = maxIdResult[0].next_id;

    // 6. Crear inscripción (CON id_canje y precio_final)
    await queryRunner.query(
      `INSERT INTO inscripcion (id_inscripcion, id_curso, id_usuario, estado, precio, precio_final, fecha_inscripcion, id_canje)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7)`,
      [
        nextId, 
        data.id_curso, 
        data.id_usuario, 
        'ACTIVA', 
        parseFloat(curso[0].costo), // Precio original
        precioFinal,                 // Precio con descuento
        data.id_canje || null        // Referencia al canje usado
      ]
    );

    console.log('✅ Inscripción creada con ID:', nextId);

    // 7. Crear pago (si se proporciona método de pago)
    if (data.metodo_pago) {
      const metodosValidos = ['TARJETA', 'TRANSFERENCIA', 'BILLETERA'];
      if (!metodosValidos.includes(data.metodo_pago)) {
        throw new BadRequestException('Método de pago no válido');
      }

      const maxIdPago = await queryRunner.query(
        'SELECT COALESCE(MAX(id_pago), 0) + 1 as next_id FROM pago'
      );

      await queryRunner.query(
        `INSERT INTO pago (id_pago, id_inscripcion, monto, metodo_pago, descuento_aplicado, fecha_pago)
         VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)`,
        [maxIdPago[0].next_id, nextId, precioFinal, data.metodo_pago, descuentoAplicado]
      );
      console.log('✅ Pago registrado');
    }

    // 8. Crear progreso inicial del curso
    const maxIdProgreso = await queryRunner.query(
      'SELECT COALESCE(MAX(id_progreso_curso), 0) + 1 as next_id FROM progreso_curso'
    );

    await queryRunner.query(
      `INSERT INTO progreso_curso (id_progreso_curso, id_curso, id_usuario, estado_curso, porcentaje_avance)
       VALUES ($1, $2, $3, 'EN_PROGRESO', 0)`,
      [maxIdProgreso[0].next_id, data.id_curso, data.id_usuario]
    );
    console.log('✅ Progreso inicial creado');

    // 9. Obtener inscripción completa para retornar
    const inscripcionCompleta = await queryRunner.query(
      `SELECT 
        i.*,
        c.nombre_curso,
        c.descripcion,
        c.duracion,
        c.modalidad,
        c.costo,
        tc.nombre_tipo_curso
      FROM inscripcion i
      JOIN curso c ON i.id_curso = c.id_curso
      LEFT JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
      WHERE i.id_inscripcion = $1`,
      [nextId]
    );

    // 10. Obtener información del pago
    const pagoInfo = await queryRunner.query(
      'SELECT * FROM pago WHERE id_inscripcion = $1',
      [nextId]
    );

    await queryRunner.commitTransaction();

    // 11. Retornar respuesta completa
    return {
      success: true,
      message: 'Inscripción realizada exitosamente',
      data: {
        inscripcion: {
          ...inscripcionCompleta[0],
          precio: parseFloat(inscripcionCompleta[0].precio),
          precio_final: parseFloat(inscripcionCompleta[0].precio_final)
        },
        pago: pagoInfo[0] || null,
        canjeAplicado: canjeUtilizado,
        resumen: {
          precio_original: parseFloat(curso[0].costo),
          descuento_aplicado: descuentoAplicado,
          precio_final: precioFinal
        }
      }
    };

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error en creación de inscripción:', error);
    
    // 🆕 IMPORTANTE: Si hay error, NO marcar el canje como usado
    // El rollbackTransaction ya revierte los cambios
    
    return {
      success: false,
      error: error.message || 'Error al realizar la inscripción'
    };
  } finally {
    await queryRunner.release();
  }
}
  // ✅ OBTENER INSCRIPCIONES CON PROGRESO (CON id_canje)
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
        i.id_canje,
        c.nombre_curso,
        c.descripcion,
        c.duracion,
        c.modalidad,
        c.costo,
        tc.nombre_tipo_curso,
        COALESCE(pc.porcentaje_avance, 0) as progreso,
        COALESCE(pc.estado_curso, 'EN_PROGRESO') as estado_curso,
        pc.fecha_actualizacion,
        cj.id_canje as canje_id,
        r.nombre as nombre_recompensa,
        r.criterio as criterio_recompensa
      FROM inscripcion i
      JOIN curso c ON i.id_curso = c.id_curso
      LEFT JOIN tipo_curso tc ON c.id_tipo_curso = tc.id_tipo_curso
      LEFT JOIN progreso_curso pc ON pc.id_curso = c.id_curso AND pc.id_usuario = i.id_usuario
      LEFT JOIN canje cj ON i.id_canje = cj.id_canje
      LEFT JOIN recompensa r ON cj.id_recompensa = r.id_recompensa
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
      id_canje: insc.id_canje,
      progreso: parseFloat(insc.progreso) || 0,
      estado_curso: insc.estado_curso || 'EN_PROGRESO',
      completado: parseFloat(insc.progreso) === 100,
      fecha_ultima_actualizacion: insc.fecha_actualizacion,
      canje_info: insc.canje_id ? {
        id_canje: insc.canje_id,
        nombre_recompensa: insc.nombre_recompensa,
        criterio: insc.criterio_recompensa
      } : null,
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