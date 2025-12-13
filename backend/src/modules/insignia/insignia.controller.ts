// src/modules/insignia/insignia.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InsigniaService } from './insignia.service';
import { CreateInsigniaDto } from './create-insignia.dto';
import { Insignia } from './insignia.entity';

@Controller('insignias')
export class InsigniaController {
  constructor(private svc: InsigniaService) {}

  @Post()
  async create(@Body() createInsigniaDto: CreateInsigniaDto): Promise<Insignia> {
    try {
      return await this.svc.create(createInsigniaDto);
    } catch (error) {
      throw new HttpException(
        `Error al crear insignia: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(): Promise<Insignia[]> {
    return await this.svc.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Insignia> {
    return await this.svc.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Insignia>,
  ): Promise<Insignia> {
    return await this.svc.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.svc.remove(id);
    return { message: `Insignia con ID ${id} eliminada exitosamente` };
  }
}