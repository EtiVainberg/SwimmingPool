import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, } from '@nestjs/common';
import { SatisfactionService } from './satisfaction.service';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { RolesGuard } from 'src/Roles/roles.guard';
import { Satisfaction } from 'src/Schemas/satisfaction/satisfaction';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('satisfaction')
export class SatisfactionController {

  constructor(private satisfactionService: SatisfactionService, private authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('add')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async add(@Body() satisfaction: Satisfaction, @Req() request) {
    return await this.satisfactionService.create(this.authService.extractTokenFromHeader(request), satisfaction);
  }

  @HttpCode(HttpStatus.OK)
  @Get('get')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.Admin,Role.User)
  getSatisfaction() {
    return this.satisfactionService.getSatisfaction();
  }

  @Get('check')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  checkSatisfaction(@Req() request) {
    return this.satisfactionService.checkSatisfaction(this.authService.extractTokenFromHeader(request));
  }

}
