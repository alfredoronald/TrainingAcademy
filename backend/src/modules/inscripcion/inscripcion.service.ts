import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscripcion } from './inscripcion.entity';
import { CreateInscripcionDto } from './inscripcion.dto';
import { Curso } from '../curso/curso.entity';
import { Pago } from '../pago/pago.entity';
import { ProgresoCurso } from '../progreso-curso/progreso-curso.entity';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Curso)
    private cursoRepository: Repository<Curso>,
    @InjectRepository(Pago)
    private pagoRepository: Repository<Pago>,
    @InjectRepository(ProgresoCurso)
    private progresoCursoRepository: Repository<ProgresoCurso>,
  ) {}

  async create(createInscripcionDto: CreateInscripcionDto) {
    const { id_curso, id_usuario, metodo_pago } = createInscripcionDto;

    console.log('🔍 Método de pago recibido del frontend:', metodo_pago);
    console.log('🔍 Datos completos del DTO:', createInscripcionDto);

    // Verificar si ya está inscrito
    const existeInscripcion = await this.inscripcionRepository.findOne({
      where: { 
        id_curso: id_curso, 
        id_usuario: id_usuario 
      }
    });

    if (existeInscripcion) {
      throw new ConflictException('Ya estás inscrito en este curso');
    }

    // Obtener información del curso
    const curso = await this.cursoRepository.findOne({
      where: { id_curso: id_curso }
    });

    if (!curso) {
      throw new NotFoundException('Curso no encontrado');
    }

    // Crear inscripción
    const inscripcion = this.inscripcionRepository.create({
      id_curso: id_curso,
      id_usuario: id_usuario,
      precio: curso.costo,
      precio_final: curso.costo,
      estado: 'ACTIVA'
    });

    const inscripcionGuardada = await this.inscripcionRepository.save(inscripcion);

    // Método de pago
    const metodoPagoFinal = metodo_pago || 'TARJETA';
    
    console.log('🔍 Método de pago a guardar en BD:', metodoPagoFinal);

    // Crear pago
    const pago = this.pagoRepository.create({
      id_inscripcion: inscripcionGuardada.id_inscripcion,
      monto: curso.costo,
      metodo_pago: metodoPagoFinal,
      descuento_aplicado: 0,
      fecha_pago: new Date()
    });

    const pagoGuardado = await this.pagoRepository.save(pago);

    // 🆕 CREAR REGISTRO DE PROGRESO DEL CURSO
    const progresoCurso = this.progresoCursoRepository.create({
      id_curso: id_curso,
      id_usuario: id_usuario,
      estado_curso: 'EN_PROGRESO',
      porcentaje_avance: 0,
      fecha_actualizacion: new Date()
    });

    await this.progresoCursoRepository.save(progresoCurso);

    console.log('🔍 Progreso de curso creado para el usuario:', id_usuario);

    return {
      inscripcion: inscripcionGuardada,
      pago: pagoGuardado,
      curso: curso
    };
  }

  async findByUsuario(idUsuario: number) {
    return await this.inscripcionRepository.find({
      where: { id_usuario: idUsuario },
      relations: ['curso', 'pagos']
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id_inscripcion: id },
      relations: ['curso', 'pagos']
    });

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    return inscripcion;
  }

  // 🆕 MÉTODOS CORREGIDOS PARA PROGRESO DE CURSOS
  async getProgresoCursosUsuario(idUsuario: number) {
    try {
      // Obtener todas las inscripciones activas del usuario
      const inscripciones = await this.inscripcionRepository.find({
        where: { 
          id_usuario: idUsuario,
          estado: 'ACTIVA'
        },
        relations: ['curso']
      });

      console.log(`📊 Encontradas ${inscripciones.length} inscripciones para usuario ${idUsuario}`);

      // Obtener el progreso de cada curso
      const cursosConProgreso = await Promise.all(
        inscripciones.map(async (inscripcion) => {
          try {
            const progreso = await this.progresoCursoRepository.findOne({
              where: {
                id_usuario: idUsuario,
                id_curso: inscripcion.id_curso
              }
            });

            console.log(`📈 Progreso para curso ${inscripcion.id_curso}:`, progreso);

            // 🟡 CORREGIDO: Mantener la estructura de objeto separado
            return {
              inscripcion: inscripcion,
              progreso: progreso || {
                id_progreso_curso: null,
                id_curso: inscripcion.id_curso,
                id_usuario: idUsuario,
                porcentaje_avance: 0,
                estado_curso: 'EN_PROGRESO',
                fecha_actualizacion: inscripcion.fecha_inscripcion
              }
            };
          } catch (error) {
            console.error(`❌ Error cargando progreso para curso ${inscripcion.id_curso}:`, error);
            return {
              inscripcion: inscripcion,
              progreso: {
                id_progreso_curso: null,
                id_curso: inscripcion.id_curso,
                id_usuario: idUsuario,
                porcentaje_avance: 0,
                estado_curso: 'EN_PROGRESO',
                fecha_actualizacion: inscripcion.fecha_inscripcion
              }
            };
          }
        })
      );

      return cursosConProgreso;
    } catch (error) {
      console.error('❌ Error en getProgresoCursosUsuario:', error);
      throw new InternalServerErrorException('Error al cargar el progreso de los cursos');
    }
  }

  async getProgresoCursoUsuario(idUsuario: number, idCurso: number) {
    try {
      const progreso = await this.progresoCursoRepository.findOne({
        where: {
          id_usuario: idUsuario,
          id_curso: idCurso
        }
      });

      if (!progreso) {
        console.log(`⚠️ No se encontró progreso para usuario ${idUsuario} en curso ${idCurso}`);
        // Retornar progreso por defecto en lugar de lanzar error
        return {
          id_progreso_curso: null,
          id_curso: idCurso,
          id_usuario: idUsuario,
          porcentaje_avance: 0,
          estado_curso: 'EN_PROGRESO',
          fecha_actualizacion: new Date()
        };
      }

      console.log(`✅ Progreso encontrado:`, progreso);
      return progreso;
    } catch (error) {
      console.error('❌ Error en getProgresoCursoUsuario:', error);
      // Retornar progreso por defecto en caso de error
      return {
        id_progreso_curso: null,
        id_curso: idCurso,
        id_usuario: idUsuario,
        porcentaje_avance: 0,
        estado_curso: 'EN_PROGRESO',
        fecha_actualizacion: new Date()
      };
    }
  }

  // 🆕 MÉTODO PARA ACTUALIZAR PROGRESO DEL CURSO
  async actualizarProgresoCurso(idUsuario: number, idCurso: number, porcentajeAvance: number) {
    try {
      let progreso = await this.progresoCursoRepository.findOne({
        where: {
          id_usuario: idUsuario,
          id_curso: idCurso
        }
      });

      if (!progreso) {
        // Crear progreso si no existe
        progreso = this.progresoCursoRepository.create({
          id_usuario: idUsuario,
          id_curso: idCurso,
          porcentaje_avance: porcentajeAvance,
          estado_curso: porcentajeAvance === 100 ? 'COMPLETADO' : 'EN_PROGRESO',
          fecha_actualizacion: new Date()
        });
      } else {
        // Actualizar progreso existente
        progreso.porcentaje_avance = porcentajeAvance;
        progreso.estado_curso = porcentajeAvance === 100 ? 'COMPLETADO' : 'EN_PROGRESO';
        progreso.fecha_actualizacion = new Date();
      }

      return await this.progresoCursoRepository.save(progreso);
    } catch (error) {
      console.error('❌ Error actualizando progreso:', error);
      throw new InternalServerErrorException('Error al actualizar el progreso del curso');
    }
  }

  // 🆕 MÉTODO DEBUG - AGREGA ESTO AL FINAL, DENTRO DE LA CLASE
  async debugProgresoCurso() {
    try {
      const count = await this.progresoCursoRepository.count();
      const allRecords = await this.progresoCursoRepository.find({
        take: 5 // Limitar a 5 registros para no saturar
      });
      
      return {
        success: true,
        message: 'Tabla progreso_curso accesible',
        total: count,
        records: allRecords
      };
    } catch (error) {
      console.error('❌ Error en debugProgresoCurso:', error);
      return {
        success: false,
        message: 'Error accediendo a la tabla progreso_curso',
        error: error.message
      };
    }
  }
} // 🟡 IMPORTANTE: Esta llave cierra la clase Inscrip