import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PermisoService } from './permiso.service';
import { CreatePermisoDto } from './permiso.dto';

@Controller('permiso')
export class PermisoController {
    constructor(private readonly permisoService: PermisoService) {}

    @Post()
    create(@Body() dto: CreatePermisoDto) {
        return this.permisoService.create(dto);
    }

    @Get()
    findAll() {
        return this.permisoService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permisoService.findOne(+id);
    }
}