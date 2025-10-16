import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleRol } from './detalle-rol.entity';
import { DetalleRolService } from './detalle-rol.service';
import { DetalleRolController } from './detalle-rol.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleRol])],
  providers: [DetalleRolService],
  controllers: [DetalleRolController]
})
export class DetalleRolModule {}
