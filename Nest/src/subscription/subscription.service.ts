import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionDocument, SubscriptionType, getPrice } from 'src/Schemas/subscription/subscription';
import { addMonths, addYears, addWeeks } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/Schemas/user.schema';
@Injectable()
export class SubscriptionService {


    constructor(
        @InjectModel('Subscription') private readonly SubscriptionModel: Model<SubscriptionDocument>,
        @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
            private jwtService: JwtService,
        private authService: AuthService) { }

    async add(type: SubscriptionType, token: string) {
        const startDate = new Date();
        let endDate: Date;
        switch (type) {
            case SubscriptionType.Monthly:
                endDate = addMonths(startDate, 1); // Add 1 month to the current date
                break;
            case SubscriptionType.Yearly:
                endDate = addYears(startDate, 1); // Add 1 year to the current date
                break;
            case SubscriptionType.Weekly:
                endDate = addWeeks(startDate, 1); // Add 1 week to the current date
                break;
            default:
                break;
        }

        let decodedToken: { [x: string]: string; };
        decodedToken = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
        });

        const user_id = await this.usersService.findOneByEmail(decodedToken['email']);

        const newSubscribe = {
            SubscriptionType: type,
            StartDate: startDate, // Corrected property name to "StartDate"
            EndDate: endDate,
            User: user_id,
        };

        const newUser = await new this.SubscriptionModel({
            SubscriptionType: type,
            StartDate: startDate, // Corrected property name to "StartDate"
            EndDate: endDate,
            User: user_id,
        }).save();
        return newUser;

    }

    async check(token: string) {
        try {
            const currentDate = new Date();
            const decodedToken = await this.authService.decoded(token);
            const user_id = await this.usersService.findOneByEmail(decodedToken['email']);
            const res = await this.SubscriptionModel.find({ User: user_id, EndDate: { $gt: currentDate } }).exec();

            return res.length == 1 ? true : false;
        }
        catch (error) {
            console.error('An error occurred:', error.message);
            return { success: false, error: 'Failed to check subscription' };
        }
    }

    async getPrice(type: SubscriptionType) {

        return getPrice(type); // returns 500

    }

    async getDetails(userId: Object | User) {
        const currentDate = new Date();
        return await this.SubscriptionModel.findOne({ User: userId, EndDate: { $gt: currentDate } });
    }
}
