import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgresoModulo } from './progreso-modulo.entity';
import { ProgresoModuloService } from './progreso-modulo.service';
import { ProgresoModuloController } from './progreso-modulo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProgresoModulo])],
  providers: [ProgresoModuloService],
  controllers: [ProgresoModuloController],
})
export class ProgresoModuloModule {}
