import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
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
import { CommentsDocument } from 'src/Schemas/comments/comments';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comments') private readonly CommentsModel: Model<CommentsDocument>, private readonly authService: AuthService, private usersService: UsersService
  ) { }


  async create(data: any, token: string) {
    try {
      const { content } = data;
      const user_id = token ? await this.getUserIdFromToken(token) : undefined;

      if (user_id) {
        const comment = new this.CommentsModel({ user: user_id, content, date: new Date() });
        console.log(content);

        await comment.save();
        return comment;
      } else {
        const { firstName, email, address } = data;
        const comment = new this.CommentsModel({ firstName, email, address, content, date: new Date() });
        await comment.save();
        return comment;
      }

    }
    catch (error) {
      console.error('Error:', error);
      throw error;
    }

  }


  private async getUserIdFromToken(token: string): Promise<User | undefined> {
    try {
      const decodedToken = await this.authService.decoded(token);
      const user_id = await this.usersService.findOneByEmail(decodedToken['email']);
      return user_id;
    } catch (error) {
      // Handle invalid token or token without a user here
      return undefined;
    }
  }

}
