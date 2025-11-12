import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CanjeService } from './canje.service';
import { CreateCanjeDto } from './canje.dto';

@Controller('canjes')
export class CanjeController {
  constructor(private readonly canjeService: CanjeService) {}

  @Post()
  async create(@Body() createCanjeDto: CreateCanjeDto) {
    console.log('🎯 POST /api/canjes - Creando canje:', createCanjeDto);
    return await this.canjeService.create(createCanjeDto);
  }

  @Get('usuario/:idUsuario')
  async findByUsuario(@Param('idUsuario') idUsuario: string) {
    console.log(`🎯 GET /api/canjes/usuario/${idUsuario} - Buscando canjes`);
    const idUsuarioNumber = parseInt(idUsuario, 10);
    return await this.canjeService.findByUsuario(idUsuarioNumber);
  }

  @Get()
  async findAll() {
    console.log('🎯 GET /api/canjes - Obteniendo todos los canjes');
    return await this.canjeService.findAll();
  }
}