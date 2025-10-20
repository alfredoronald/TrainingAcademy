import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { RolService } from './rol.service';

@Controller('roles')
export class RolController {
  constructor(private svc: RolService) {}

  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.svc.findOne(Number(id)); }
  @Put(':id') update(@Param('id') id: string, @Body() b: any) { return this.svc.update(Number(id), b); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(Number(id)); }
}
