import { Controller, Post, Get, Body } from '@nestjs/common';
import { ForoService } from './foro.service';

@Controller('foros')
export class ForoController {
  constructor(private svc: ForoService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Post('mensajes') addMensaje(@Body() b: any) { return this.svc.addMensaje(b); }
}
