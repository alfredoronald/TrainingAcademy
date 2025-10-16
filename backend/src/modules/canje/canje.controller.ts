import { Controller, Post, Get, Body } from '@nestjs/common';
import { CanjeService } from './canje.service';

@Controller('canjes')
export class CanjeController {
  constructor(private svc: CanjeService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
}
