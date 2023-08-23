import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/Schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { CommentsDocument } from 'src/Schemas/comments/comments';
import { UsersService } from 'src/users/users.service';
import { status } from 'src/Schemas/comments/comments'
@Injectable()
export class CommentsService {


  constructor(
    @InjectModel('Comments') private readonly CommentsModel: Model<CommentsDocument>,
    @InjectModel('User') private readonly UserModel: Model<User>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) { }


  async create(data: any, token: string) {
    try {
      const { content } = data;
      const user_id = token ? await this.getUserIdFromToken(token) : undefined;

      if (user_id) {
        const comment = new this.CommentsModel({ user: user_id, content, date: new Date() });
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

  async updateStatus(user_id: string) {
    return await this.CommentsModel.findByIdAndUpdate(user_id, { status: status.old });
  
  }

  async get() {
    try {
      const comments = await this.CommentsModel.find({ status: status.new }).populate('user').exec();
      return comments;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

}
