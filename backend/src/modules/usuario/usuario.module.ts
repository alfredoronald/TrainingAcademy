import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Rol } from '../rol/rol.entity';
import { DetalleRol } from '../detalle-rol/detalle-rol.entity';

@Module({
  imports: [
    // 👇 Agregamos las tres entidades necesarias
    TypeOrmModule.forFeature([Usuario, Rol, DetalleRol]),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
