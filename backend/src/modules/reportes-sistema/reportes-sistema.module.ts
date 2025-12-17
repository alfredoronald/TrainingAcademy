import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesSistemaService } from './reportes-sistema.service';
import { ReportesSistemaController } from './reportes-sistema.controller';
import { ReporteSistema } from './reportes-sistema.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReporteSistema]),
  ],
  controllers: [ReportesSistemaController],
  providers: [ReportesSistemaService],
  exports: [ReportesSistemaService],
})
export class ReportesSistemaModule {}