import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditDetails, CreditDetailsDocument } from 'src/Schemas/credit-details.schema';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PaymentDetailsService {
    
    constructor(@InjectModel('CreditDetails') private readonly creditDetails: Model<CreditDetailsDocument>, private usersService: UsersService, private jwtService: JwtService) {
    }

    async addPaymentDetails(creditDetails: CreditDetails, token: string) {
        const decodedToken =await this.decoded(token);
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
            console.log(newDetails);
            return HttpStatus.CREATED;
        }
        catch (error) {
            const status = HttpStatus.CONFLICT;
            throw new HttpException({ message: error.message, status }, status);
        }
    }

    async checkStorageCreditDetails(token: string) {
        let decodedToken =await this.decoded(token);        
        const user_id =await this.usersService.findOneByEmail(decodedToken['email']);        
        const currentDate = new Date();

        const creditDetails = await this.creditDetails.findOne({ user: user_id, expDate: { $gt: currentDate } }).exec();
        
        if (creditDetails) {            
            return creditDetails.cardNumber.substring(12, 16);
        }
        return 0;
    }

    async decoded(token:string) {
        let decodedToken: { [x: string]: string; };
        try {
            decodedToken = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            return decodedToken;
        }
        catch (error) {
            const status = HttpStatus.UNAUTHORIZED;
            throw new HttpException({ message: error.message, status }, HttpStatus.UNAUTHORIZED);
        }
    }
}
