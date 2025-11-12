import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canje } from './canje.entity';
import { CreateCanjeDto } from './canje.dto';
import { Recompensa } from '../recompensa/recompensa.entity';
import { Usuario } from '../usuario/usuario.entity';
import { Puntos } from '../puntaje/puntaje.entity';

@Injectable()
export class CanjeService {
  constructor(
    @InjectRepository(Canje)
    private readonly canjeRepository: Repository<Canje>,
    
    @InjectRepository(Recompensa)
    private readonly recompensaRepository: Repository<Recompensa>,
    
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    
    @InjectRepository(Puntos)
    private readonly puntosRepository: Repository<Puntos>,
  ) {}

  async create(createCanjeDto: CreateCanjeDto): Promise<Canje> {
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

      // 3. OBTENER LOS PUNTOS DEL USUARIO (solo para verificación y mensaje de error)
      const puntosUsuario = await this.puntosRepository.findOne({
        where: { usuario: { id_usuario: createCanjeDto.id_usuario } }
      });

      if (!puntosUsuario) {
        throw new ConflictException('Usuario no tiene puntos registrados');
      }

      console.log(`🔍 Verificando puntos: Usuario ${puntosUsuario.total_saldo_puntos} vs Recompensa ${recompensa.puntos_requeridos}`);
      
      // 4. VERIFICAR PUNTOS SUFICIENTES (solo para mensaje de error amigable)
      if (puntosUsuario.total_saldo_puntos < recompensa.puntos_requeridos) {
        throw new ConflictException(
          `Puntaje insuficiente. Tienes ${puntosUsuario.total_saldo_puntos} puntos pero necesitas ${recompensa.puntos_requeridos} puntos para esta recompensa`
        );
      }

      // 5. OBTENER EL PRÓXIMO ID_CANJE - CORREGIDO
      const ultimoCanje = await this.canjeRepository.findOne({
        where: {}, // ← CONDICIÓN REQUERIDA
        order: { id_canje: 'DESC' }
      });
      
      const proximoId = ultimoCanje ? ultimoCanje.id_canje + 1 : 1;
      console.log(`🔍 Próximo ID de canje: ${proximoId}`);

      // 6. SOLO crear el canje - LOS PUNTOS SE RESTAN AUTOMÁTICAMENTE POR EL TRIGGER
      const canje = this.canjeRepository.create({
        id_canje: proximoId,
        id_usuario: createCanjeDto.id_usuario,
        id_recompensa: createCanjeDto.id_recompensa
      });

      const savedCanje = await this.canjeRepository.save(canje);
      console.log('✅ Canje creado exitosamente. Los puntos se restarán automáticamente por el trigger.');
      return savedCanje;

    } catch (error) {
      console.error('❌ Error creando canje:', error);
      throw error;
    }
  }

  async findByUsuario(idUsuario: number): Promise<Canje[]> {
    console.log(`🔍 Buscando canjes para usuario ${idUsuario}...`);
    try {
      const canjes = await this.canjeRepository.find({
        where: { id_usuario: idUsuario },
        relations: ['recompensa'],
        order: { fecha_canje: 'DESC' }
      });
      console.log(`✅ Encontrados ${canjes.length} canjes para usuario ${idUsuario}`);
      return canjes;
    } catch (error) {
      console.error('❌ Error buscando canjes:', error);
      throw error;
    }
  }

  async findAll(): Promise<Canje[]> {
    console.log('🔍 Buscando todos los canjes...');
    try {
      const canjes = await this.canjeRepository.find({
        relations: ['recompensa'],
        order: { fecha_canje: 'DESC' }
      });
      console.log(`✅ Encontrados ${canjes.length} canjes en total`);
      return canjes;
    } catch (error) {
      console.error('❌ Error obteniendo canjes:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Canje | null> {
    return await this.canjeRepository.findOne({
      where: { id_canje: id },
      relations: ['recompensa']
    });
  }

  async remove(id: number): Promise<void> {
    const canje = await this.findOne(id);
    if (!canje) {
      throw new NotFoundException(`Canje con ID ${id} no encontrado`);
    }
    await this.canjeRepository.remove(canje);
    console.log(`✅ Canje ${id} eliminado`);
  }
}
