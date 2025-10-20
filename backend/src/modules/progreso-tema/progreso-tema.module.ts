import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgresoTema } from './progreso-tema.entity';
import { ProgresoTemaService } from './progreso-tema.service';
import { ProgresoTemaController } from './progreso-tema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProgresoTema])],
  providers: [ProgresoTemaService],
  controllers: [ProgresoTemaController],
})
export class ProgresoTemaModule {}
