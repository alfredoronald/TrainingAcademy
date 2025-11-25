import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Foro } from './foro.entity';
import { Mensaje } from '../mensaje/mensaje.entity';
import { Repository, DataSource } from 'typeorm';


@Injectable()
export class ForoService {
  constructor(
    @InjectRepository(Foro)
    private foroRepository: Repository<Foro>,
    private dataSource: DataSource,
  ) {}

  async obtenerForoPorCurso(idCurso: number) {
    const foro = await this.foroRepository.findOne({
      where: { id_curso: idCurso }
    });

    if (!foro) {
      throw new NotFoundException('Foro no encontrado para este curso');
    }

    return foro;
  }

 async crearMensaje(idForo: number, idUsuario: number, contenido: string, idMensajeRespuesta?: number) {
  const foro = await this.foroRepository.findOne({ where: { id_foro: idForo } });
  if (!foro) {
    throw new NotFoundException('Foro no encontrado');
  }

  // Si es una respuesta, verificar que el mensaje padre existe
  if (idMensajeRespuesta) {
    const mensajePadre = await this.dataSource.query(
      'SELECT * FROM MENSAJE WHERE id_mensaje = $1',
      [idMensajeRespuesta]
    );
    if (mensajePadre.length === 0) {
      throw new NotFoundException('Mensaje padre no encontrado');
    }
  }

  // Obtener el próximo ID
  const maxIdResult = await this.dataSource.query(
    'SELECT COALESCE(MAX(id_mensaje), 0) as max_id FROM MENSAJE'
  );
  const nextId = maxIdResult[0].max_id + 1;

  // Obtener fecha y hora ACTUAL en zona horaria local (Bolivia)
  const ahora = new Date();
  
  // Formatear fecha manualmente en formato YYYY-MM-DD (evitar toISOString que convierte a UTC)
  const year = ahora.getFullYear();
  const month = String(ahora.getMonth() + 1).padStart(2, '0');
  const day = String(ahora.getDate()).padStart(2, '0');
  const fechaActual = `${year}-${month}-${day}`;
  
  // Formatear hora manualmente en formato HH:MM:SS
  const hours = String(ahora.getHours()).padStart(2, '0');
  const minutes = String(ahora.getMinutes()).padStart(2, '0');
  const seconds = String(ahora.getSeconds()).padStart(2, '0');
  const horaActual = `${hours}:${minutes}:${seconds}`;

  console.log('Fecha/Hora Bolivia:', { fechaActual, horaActual }); // Para debug

  // Insertar mensaje con fecha/hora correcta de Bolivia
  const result = await this.dataSource.query(
    `INSERT INTO MENSAJE (id_mensaje, id_foro, id_usuario, contenido, fecha_envio, hora_envio, id_mensaje_respuesta) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING *`,
    [nextId, idForo, idUsuario, contenido, fechaActual, horaActual, idMensajeRespuesta || null]
  );

  // Obtener el mensaje con información del usuario
  const mensajeCompleto = await this.dataSource.query(
    `SELECT m.*, u.nombre, u.apellido 
     FROM MENSAJE m 
     LEFT JOIN USUARIO u ON m.id_usuario = u.id_usuario 
     WHERE m.id_mensaje = $1`,
    [result[0].id_mensaje]
  );

  return {
    ...mensajeCompleto[0],
    usuario: {
      id_usuario: mensajeCompleto[0].id_usuario,
      nombre: mensajeCompleto[0].nombre,
      apellido: mensajeCompleto[0].apellido
    }
  };
}

  async obtenerMensajesForo(idForo: number) {
    const mensajes = await this.dataSource.query(
      `SELECT m.*, u.nombre, u.apellido 
       FROM MENSAJE m 
       LEFT JOIN USUARIO u ON m.id_usuario = u.id_usuario 
       WHERE m.id_foro = $1 
       ORDER BY m.fecha_envio ASC, m.hora_envio ASC`,
      [idForo]
    );

    // Formatear los mensajes
    const mensajesFormateados = mensajes.map(msg => ({
      id_mensaje: msg.id_mensaje,
      id_foro: msg.id_foro,
      id_usuario: msg.id_usuario,
      contenido: msg.contenido,
      fecha_envio: msg.fecha_envio,
      hora_envio: msg.hora_envio,
      id_mensaje_respuesta: msg.id_mensaje_respuesta,
      usuario: {
        id_usuario: msg.id_usuario,
        nombre: msg.nombre,
        apellido: msg.apellido
      }
    }));

    return this.organizarMensajesJerarquicamente(mensajesFormateados);
  }

  private organizarMensajesJerarquicamente(mensajes: any[]): any[] {
    const mensajesMap = new Map();
    const mensajesRaiz: any[] = [];

    // Mapear todos los mensajes por ID
    mensajes.forEach(mensaje => {
      mensajesMap.set(mensaje.id_mensaje, {
        ...mensaje,
        respuestas: []
      });
    });

    // Organizar en jerarquía
    mensajes.forEach(mensaje => {
      const mensajeNode = mensajesMap.get(mensaje.id_mensaje);
      
      if (mensaje.id_mensaje_respuesta) {
        // Es una respuesta, agregar al mensaje padre
        const padre = mensajesMap.get(mensaje.id_mensaje_respuesta);
        if (padre) {
          padre.respuestas.push(mensajeNode);
        }
      } else {
        // Es un mensaje raíz
        mensajesRaiz.push(mensajeNode);
      }
    });

    return mensajesRaiz;
  }

  async obtenerMensajePorId(idMensaje: number) {
    const mensaje = await this.dataSource.query(
      'SELECT * FROM MENSAJE WHERE id_mensaje = $1',
      [idMensaje]
    );

    if (mensaje.length === 0) {
      throw new NotFoundException('Mensaje no encontrado');
    }

    return mensaje[0];
  }
}