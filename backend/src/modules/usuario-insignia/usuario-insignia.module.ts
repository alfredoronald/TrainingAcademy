import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioInsignia } from './usuario-insignia.entity';
import { UsuarioInsigniaService } from './usuario-insignia.service';
import { UsuarioInsigniaController } from './usuario-insignia.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioInsignia])],
  providers: [UsuarioInsigniaService],
  controllers: [UsuarioInsigniaController],
})
export class UsuarioInsigniaModule {}
