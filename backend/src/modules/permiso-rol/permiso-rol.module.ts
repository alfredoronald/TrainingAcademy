import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisoRol } from './permiso-rol.entity';
import { PermisoRolService } from './permiso-rol.service';
import { PermisoRolController } from './permiso-rol.controller';
import { Rol } from '../rol/rol.entity';
import { Permiso } from '../permiso/permiso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermisoRol, Rol, Permiso]) // Agrega Rol y Permiso aquí
  ],
  providers: [PermisoRolService],
  controllers: [PermisoRolController],
})
export class PermisoRolModule {}