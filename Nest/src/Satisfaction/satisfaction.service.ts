import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Satisfaction, SatisfactionDocument } from 'src/Schemas/satisfaction/satisfaction';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SatisfactionService {
  constructor(
    @InjectModel('Satisfaction') private readonly SatisfactionModel: Model<SatisfactionDocument>,
    private userService: UsersService, private jwtService: JwtService, private authService: AuthService) { }


  async create(token: string, satisfaction: Satisfaction) {
    const decodedToken = await this.authService.decoded(token);
    const user_id = await this.userService.findOneByEmail(decodedToken['email']);
    if (await this.checkSatisfaction(token) == 200) {
      const newSatisfaction = new this.SatisfactionModel({
        ...satisfaction,
        Date: new Date(),
        User: user_id,
      });
      await this.SatisfactionModel.create(newSatisfaction);
      return await this.getSatisfaction();
    }
  }

  async getSatisfaction() {
    return await this.SatisfactionModel.find().exec();
  }


  async checkSatisfaction(token: string) {
    const decodedToken = await this.authService.decoded(token);
    const user_id = await this.userService.findOneByEmail(decodedToken['email']);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const satisfactionEntry = await this.SatisfactionModel.findOne({
      User: user_id,
      Date: { $gte: currentDate },
    }).exec();
    
    if (satisfactionEntry) {
      throw new HttpException(
        'You have already submitted a satisfaction entry today.',
        HttpStatus.CONFLICT,
      );
    }
    else return HttpStatus.OK;
  }

}
