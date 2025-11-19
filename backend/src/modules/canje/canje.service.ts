import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canje } from './canje.entity';
import { CreateCanjeDto } from './canje.dto';
import { Recompensa } from '../recompensa/recompensa.entity';
import { Puntos } from '../puntaje/puntaje.entity';

@Injectable()
export class CanjeService {
  constructor(
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
    
    @InjectRepository(Recompensa)
    private readonly recompensaRepository: Repository<Recompensa>,
    
    @InjectRepository(Puntos)
    private readonly puntosRepository: Repository<Puntos>,
  ) {}

  async create(createCanjeDto: CreateCanjeDto): Promise<any> {
    console.log('🔄 Creando nuevo canje:', createCanjeDto);
    
    try {
      // 1. Verificar si ya existe un canje igual
      const existingCanje = await this.canjeRepository.findOne({
        where: {
          id_usuario: createCanjeDto.id_usuario,
          id_recompensa: createCanjeDto.id_recompensa
        }
      });

      if (existingCanje) {
        throw new ConflictException('Ya has canjeado esta recompensa');
      }

      // 2. Obtener información de la recompensa
      const recompensa = await this.recompensaRepository.findOne({
        where: { id_recompensa: createCanjeDto.id_recompensa }
      });

      if (!recompensa) {
        throw new NotFoundException('Recompensa no encontrada');
      }

      // 3. Verificar puntos del usuario
      const puntosUsuario = await this.puntosRepository.findOne({
        where: { usuario: { id_usuario: createCanjeDto.id_usuario } }
      });

      if (!puntosUsuario) {
        throw new ConflictException('Usuario no tiene puntos registrados');
      }

      if (puntosUsuario.total_saldo_puntos < recompensa.puntos_requeridos) {
        throw new ConflictException(
          `Puntaje insuficiente. Tienes ${puntosUsuario.total_saldo_puntos} puntos pero necesitas ${recompensa.puntos_requeridos} puntos`
        );
      }

      // 4. Crear canje
      const canje = this.canjeRepository.create({
        id_usuario: createCanjeDto.id_usuario,
        id_recompensa: createCanjeDto.id_recompensa,
        utilizado: false,
        estado: 'ACTIVO'
      });

      const savedCanje = await this.canjeRepository.save(canje);
      console.log('✅ Canje creado exitosamente:', savedCanje);

      // 5. Obtener canje completo con relaciones para retornar
      const canjeCompleto = await this.canjeRepository.findOne({
        where: { id_canje: savedCanje.id_canje },
        relations: ['recompensa']
      });

      // 🆕 VERIFICAR SI canjeCompleto ES NULL
      if (!canjeCompleto) {
        throw new NotFoundException('No se pudo recuperar el canje recién creado');
      }

      // 6. Formatear respuesta para el frontend
      return {
        ...canjeCompleto,
        nombre_recompensa: canjeCompleto.recompensa?.nombre,
        criterio: canjeCompleto.recompensa?.criterio
      };

    } catch (error) {
      console.error('❌ Error creando canje:', error);
      throw error;
    }
  }

  async findByUsuario(idUsuario: number): Promise<any[]> {
    console.log(`🔍 Buscando canjes para usuario ${idUsuario}...`);
    try {
      const canjes = await this.canjeRepository.find({
        where: { id_usuario: idUsuario },
        relations: ['recompensa'],
        order: { fecha_canje: 'DESC' }
      });

      // Formatear respuesta
      const canjesFormateados = canjes.map(canje => ({
        ...canje,
        nombre_recompensa: canje.recompensa?.nombre,
        criterio: canje.recompensa?.criterio
      }));

      console.log(`✅ Encontrados ${canjesFormateados.length} canjes para usuario ${idUsuario}`);
      return canjesFormateados;
    } catch (error) {
      console.error('❌ Error buscando canjes:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    console.log('🔍 Buscando todos los canjes...');
    try {
      const canjes = await this.canjeRepository.find({
        relations: ['recompensa'],
        order: { fecha_canje: 'DESC' }
      });

      const canjesFormateados = canjes.map(canje => ({
        ...canje,
        nombre_recompensa: canje.recompensa?.nombre,
        criterio: canje.recompensa?.criterio
      }));

      console.log(`✅ Encontrados ${canjesFormateados.length} canjes en total`);
      return canjesFormateados;
    } catch (error) {
      console.error('❌ Error obteniendo canjes:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<any | null> {
    const canje = await this.canjeRepository.findOne({
      where: { id_canje: id },
      relations: ['recompensa']
    });

    if (canje) {
      return {
        ...canje,
        nombre_recompensa: canje.recompensa?.nombre,
        criterio: canje.recompensa?.criterio
      };
    }

    return null;
  }

  async remove(id: number): Promise<void> {
    const canje = await this.canjeRepository.findOne({
      where: { id_canje: id }
    });

    if (!canje) {
      throw new NotFoundException(`Canje con ID ${id} no encontrado`);
    }

    await this.canjeRepository.remove(canje);
    console.log(`✅ Canje ${id} eliminado`);
  }
}