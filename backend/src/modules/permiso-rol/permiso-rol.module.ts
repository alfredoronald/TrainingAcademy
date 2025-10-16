import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisoRol } from './permiso-rol.entity';
import { PermisoRolService } from './permiso-rol.service';
import { PermisoRolController } from './permiso-rol.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PermisoRol])],
  providers: [PermisoRolService],
  controllers: [PermisoRolController],
})
export class PermisoRolModule {}
