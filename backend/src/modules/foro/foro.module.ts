import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Foro } from './foro.entity';
import { ForoService } from './foro.service';
import { ForoController } from './foro.controller';
import { Mensaje } from '../mensaje/mensaje.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foro, Mensaje])],
  providers: [ForoService],
  controllers: [ForoController],
})
export class ForoModule {}
