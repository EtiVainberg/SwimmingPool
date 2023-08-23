import { ConflictException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Console } from 'console';
import { unsubscribe } from 'diagnostics_channel';
import { response } from 'express';
import { Model, Types } from 'mongoose';
import { User, userDocument } from 'src/Schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ok } from 'assert';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/Roles/Role.enum';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private readonly UserModel: Model<userDocument>, private jwtService: JwtService,@Inject(forwardRef(() => AuthService)) private authService: AuthService) {
    }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.UserModel.findOne({ email: email }).exec();
    }

    async findOne(user: User): Promise<User | undefined> {
        return await this.UserModel.findOne({ email: user.email }).exec();
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return (await this.UserModel.findOne({ email: email }).exec())._id;
    }



    async create(user: User) {
        const found = await this.findOne(user);
        if (found != null)
            throw new ConflictException("User already exist");

        const { password } = user;
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);

        const reqUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            password: hashedPassword,
            role: Role.User
        }
        const newUser = await new this.UserModel(reqUser).save();
        const payload = { username: newUser.firstName, password: newUser.password, role: reqUser.role };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '60s', // Token expires after 60 seconds
            secret: jwtConstants.secret, // Secret key for JWT
        });
        return [access_token, payload.role];

    }

    async getUsers() {
        console.log();
        
        return await this.UserModel.find().exec();
    }

    async getUserDetails(token:string) {
        const decodedToken = await this.authService.decoded(token);
        return await this.findUserByEmail(decodedToken['email']);
    }

}


