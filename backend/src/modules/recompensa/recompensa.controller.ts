import { Controller, Get } from '@nestjs/common';
import { RecompensaService } from './recompensa.service';

@Controller('recompensas')
export class RecompensaController {
  constructor(private readonly recompensaService: RecompensaService) {}

  @Get()
  async findAll() {
    console.log('🎯 GET /api/recompensas - Obteniendo todas las recompensas');
    return await this.recompensaService.findAll();
  }
}