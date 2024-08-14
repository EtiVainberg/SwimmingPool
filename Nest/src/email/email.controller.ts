import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/Roles/roles.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { EmailService } from './email.service';
import { AuthService } from 'src/auth/auth.service';

@Controller('email')
export class EmailController {
    /**
     *
     */
    constructor(private readonly emailService: EmailService, private readonly authService: AuthService) {

    }

    @HttpCode(HttpStatus.PROCESSING)
    @Post(':temp')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    sendTemp(@Param('temp') temp: number, @Req() request) {
        const token = this.authService.extractTokenFromHeader(request);
        return this.emailService.sendEmailTempToManager(temp, token);
    }



}
