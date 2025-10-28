import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../modules/usuario/usuario.entity';
import { DetalleRol } from '../modules/detalle-rol/detalle-rol.entity';
import { UsuarioModule } from '../modules/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, DetalleRol]),
    UsuarioModule, // porque AuthService usa UsuarioService
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // lo exportamos por si se necesita en otro módulo
})
export class AuthModule {}
