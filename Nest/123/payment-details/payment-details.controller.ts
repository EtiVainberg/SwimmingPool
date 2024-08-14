import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Get } from '@nestjs/common';
import { CreditDetails } from 'src/Schemas/credit-details.schema';
import { PaymentDetailsService } from './payment-details.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { RolesGuard } from 'src/Roles/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('payment')
export class PaymentDetailsController {

    constructor(private creditDetails: PaymentDetailsService, private jwtService: JwtService,private authService:AuthService) { }
    
    
    @HttpCode(HttpStatus.OK)
    @Get('check')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin,Role.User)
    async checkPayment(@Req() request) {
        return await this.creditDetails.checkStorageCreditDetails(this.authService.extractTokenFromHeader(request));
    }


    @HttpCode(HttpStatus.CREATED)
    @Post('/')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    async newCreditDetails(@Body() creditCardDetails: CreditDetails, @Req() request) {
        
        return this.creditDetails.addPaymentDetails(creditCardDetails, this.authService.extractTokenFromHeader(request));
    }

}
