import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Roles } from 'src/Roles/roles.decorator';
import { Role } from 'src/Roles/Role.enum';
import { RolesGuard } from 'src/Roles/roles.guard';

@Controller('/')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() body: any) {
    return this.authService.signIn(body.email, body.password);
  }
  


  @Get('profile')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  getProfile(@Request() req) {
    return req.user;
  }
}