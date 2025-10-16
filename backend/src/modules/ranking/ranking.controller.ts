import { Controller, Post, Get, Body } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('rankings')
export class RankingController {
  constructor(private svc: RankingService) {}
  @Post() create(@Body() b: any) { return this.svc.create(b); }
  @Get() findAll() { return this.svc.findAll(); }
}
