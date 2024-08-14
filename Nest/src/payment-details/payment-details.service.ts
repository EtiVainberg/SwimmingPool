import { ConflictException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditDetails, CreditDetailsDocument } from 'src/Schemas/credit-details.schema';
import { AuthService } from 'src/auth/auth.service';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentDetailsService {
    
    constructor(@InjectModel('CreditDetails') private readonly creditDetails: Model<CreditDetailsDocument>,
        private usersService: UsersService, private jwtService: JwtService,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService) {
    }

    async addPaymentDetails(creditDetails: CreditDetails, token: string) {
        const decodedToken =await this.authService.decoded(token);
        try {
            const user_id = await this.usersService.findOneByEmail(decodedToken['email']);
            const trimmedCardNumber = creditDetails.cardNumber.replace(/\s+/g, '');

            // Create a new object with the trimmed cardNumber
            const newCreditDetails = new this.creditDetails({
              ...creditDetails,
              user: user_id,
              cardNumber: trimmedCardNumber,
            });
            const newDetails = await new this.creditDetails(newCreditDetails).save();
            return HttpStatus.CREATED;
        }
        catch (error) {
            const status = HttpStatus.CONFLICT;
            throw new HttpException({ message: error.message, status }, status);
        }
    }

    async checkStorageCreditDetails(token: string) {
        let decodedToken =await this.authService.decoded(token);        
        const user_id =await this.usersService.findOneByEmail(decodedToken['email']);        
        const currentDate = new Date();

        const creditDetails = await this.creditDetails.findOne({ user: user_id, expDate: { $gt: currentDate } }).exec();
        
        if (creditDetails) {            
            return creditDetails.cardNumber.substring(12, 16);
        }
        return 0;
    }
}
