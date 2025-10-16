import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canje } from './canje.entity';
import { CanjeService } from './canje.service';
import { CanjeController } from './canje.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Canje])],
  providers: [CanjeService],
  controllers: [CanjeController],
})
export class CanjeModule {}
