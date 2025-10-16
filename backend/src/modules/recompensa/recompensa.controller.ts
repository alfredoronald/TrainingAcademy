import { Controller, Post, Get, Body } from '@nestjs/common';
import { RecompensaService } from './recompensa.service';

@Controller('recompensas')
export class RecompensaController {
  constructor(private svc: RecompensaService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Post('canjear') canjear(@Body() b: any) { return this.svc.canjear(b); }
}
