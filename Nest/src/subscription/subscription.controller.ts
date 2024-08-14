import { Body, Controller, HttpCode, HttpStatus, Post, Req, Header, UseGuards, Get, Param, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { RolesGuard } from 'src/Roles/roles.guard';
import { SubscriptionService } from './subscription.service';
import { SubscriptionType } from 'src/Schemas/subscription/subscription';
import { AuthService } from 'src/auth/auth.service';

@Controller('subscription')
export class SubscriptionController {

    /**
     *
     */
    constructor(private subscriptionService: SubscriptionService,private authService:AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post('add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    async newSubscription(@Body('duration') duration: SubscriptionType, @Req() req) {
        return this.subscriptionService.add(duration, this.authService.extractTokenFromHeader(req));
    }

    @HttpCode(HttpStatus.OK)
    @Get('check')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    async checkActiveSubscription(@Req() req) {        
        return this.subscriptionService.check(this.authService.extractTokenFromHeader(req));
    }

    @HttpCode(HttpStatus.OK)
    @Get('price')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    async getPrice(@Query('type') type: SubscriptionType) {        
        return this.subscriptionService.getPrice(type);
    }

}
