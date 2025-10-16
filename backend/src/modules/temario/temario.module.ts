import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temario } from './temario.entity';
import { TemarioService } from './temario.service';
import { TemarioController } from './temario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Temario])],
  providers: [TemarioService],
  controllers: [TemarioController],
})
export class TemarioModule {}
