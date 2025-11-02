import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './curso.dto';
import { UpdateCursoDto } from './update-curso.dto';

@Controller('cursos')
export class CursoController {
  constructor(private readonly svc: CursoService) {}

  // Crear curso
  @Post()
async create(@Body() createCursoDto: CreateCursoDto) {
  try {
    return await this.svc.create(createCursoDto);
  } catch (error) {
    console.error('Error creando curso:', error);
    throw error;
  }
}


  // Obtener todos los cursos
  @Get()
  async findAll(@Query('docente') docenteId?: string) {
    const cursos = await this.svc.findAll();
    if (docenteId) {
      // Filtrar cursos por docente si se pasa query ?docente=
      return cursos.filter(c => c.docente?.id_usuario === +docenteId);
    }
    return cursos;
  }

  // Obtener curso por ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.svc.findOne(+id);
  }

  // Actualizar curso
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return await this.svc.update(+id, updateCursoDto); // 🔹 método correcto del servicio
  }

  // Eliminar curso
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.svc.remove(+id); // 🔹 método correcto del servicio
  }
}
