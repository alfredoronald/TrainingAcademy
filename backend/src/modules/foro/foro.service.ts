import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Foro } from './foro.entity';
import { Mensaje } from '../mensaje/mensaje.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ForoService {
  constructor(
    @InjectRepository(Foro) private foroRepo: Repository<Foro>,
    @InjectRepository(Mensaje) private msgRepo: Repository<Mensaje>,
  ) {}

  // Obtener el foro de un curso con sus mensajes
  async obtenerForoCurso(idCurso: number) {
    const foro = await this.foroRepo.findOne({
      where: { curso: { id_curso: idCurso } },
      relations: ['curso', 'mensajes', 'mensajes.usuario'],
      order: { fecha_creacion: 'DESC' },
    });
    if (!foro) throw new NotFoundException('Foro no encontrado');
    return foro;
  }

  // Agregar mensaje al foro corregido
  async agregarMensaje(idCurso: number, idUsuario: number, contenido: string) {
  const foro = await this.foroRepo.findOne({
    where: { curso: { id_curso: idCurso } }
  });
  if (!foro) throw new NotFoundException('Foro no encontrado');

  const mensaje = this.msgRepo.create({
    foro,
    usuario: { id_usuario: idUsuario } as any,
    contenido,
    fecha_publicacion: new Date(),
  });

  return this.msgRepo.save(mensaje);
}

  // Crear foro
  create(data: Partial<Foro>) {
    return this.foroRepo.save(this.foroRepo.create(data));
  }

  // Obtener todos los foros
  findAll() {
    return this.foroRepo.find({ relations: ['mensajes'] });
  }

  // Alternativa para agregar mensaje
  addMensaje(data: Partial<Mensaje>) {
    return this.msgRepo.save(this.msgRepo.create(data));
  }
}
