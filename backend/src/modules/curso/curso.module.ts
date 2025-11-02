import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { Curso } from './curso.entity';
import { Usuario } from '../usuario/usuario.entity'; // <-- importa la entidad Usuario

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Usuario]), // <-- ambos repositorios disponibles
  ],
  providers: [CursoService],
  controllers: [CursoController],
})
export class CursoModule {}
