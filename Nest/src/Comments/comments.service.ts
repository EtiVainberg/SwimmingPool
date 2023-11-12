
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/Schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { CommentsDocument } from 'src/Schemas/comments/comments';
import { UsersService } from 'src/users/users.service';
import { status } from 'src/Schemas/comments/comments'
import { da } from 'date-fns/locale';
@Injectable()
export class CommentsService {
  static x: number = 0;

  constructor(
    @InjectModel('Comments') private readonly CommentsModel: Model<CommentsDocument>,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
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

  async updateStatus(commentId: string) {

    return await this.CommentsModel.findByIdAndUpdate(commentId, { status: status.old });
  }

  async updateReplyStatus(commentId: string) {
    return await this.CommentsModel.findByIdAndUpdate(commentId, { statusReply: status.old });
  }

  async get() {
    try {
      // const comments = await this.CommentsModel.find({ status: status.new }).populate('user').exec();
      const comments = await this.CommentsModel
        .find()
        .populate('user')
        .sort({ date: -1 }) // Sort in descending order based on the 'date' field
        .limit(20) // Limit the results to 20 comments
        .exec();
      return comments;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getAmountOfNewReply(token: string) {
    try {
      const decodedToken = await this.authService.decoded(token);
      const user_id = await this.usersService.findOneByEmail(decodedToken['email']);      // const comments = await this.CommentsModel.find({ status: status.new }).populate('user').exec();
      const comments = await this.CommentsModel
        .find({ user: user_id, statusReply: status.new })
        .count()
        .exec();
      return comments;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getNewReply(_id: User) {
    try {
      return (await this.CommentsModel.find({ user: _id, statusReply: 'new' })).length;
    }
    catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async reply(reply: string, _id: string) {
    try {
      return await this.CommentsModel.findByIdAndUpdate(_id, { reply: reply, status: status.old });
    }
    catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async getCommentAndReply(token: string, skip: number, limit: number) {
   
    try {
      const decodedToken = await this.authService.decoded(token);

      // Find the user based on the email from the decoded token
      const user_id = await this.usersService.findOneByEmail(decodedToken['email']);

      // Fetch comments that belong to the identified user
      const comments = await this.CommentsModel
        .find({ user: user_id }) // Assuming user._id is the correct reference
        .sort({ date: -1 })// Sort by date in descending order (newest first)
        .skip(skip) // Skip the specified number of comments
        .limit(limit) // Limit the result to the specified number of comments
        .exec();

      return comments;
    }
    catch (error) {
      console.error('Error:', error);
      throw error;
    }

  }
}
// }

