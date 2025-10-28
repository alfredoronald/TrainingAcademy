import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from '../usuario/usuario.module'; // si usas usuarios en Auth
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/usuario.entity';
import { DetalleRol } from '../detalle-rol/detalle-rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, DetalleRol]),
    UsuarioModule, // 👈 importante si usas UsuarioService dentro de AuthService
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // 👈 esto permite que otros módulos lo usen
})
export class AuthModule {}
