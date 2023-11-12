
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Put, Query, Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { RolesGuard } from 'src/Roles/roles.guard';
import { AuthService } from 'src/auth/auth.service';
import { request } from 'http';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService, private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('add')
  add(@Body('data') data: object, @Req() request) {
   

    return this.commentsService.create(data, this.authService.extractTokenFromHeader(request));
  }

  @HttpCode(HttpStatus.OK)
  @Get('get')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  get() {
    return this.commentsService.get();
  }

  @HttpCode(HttpStatus.OK)
  @Get('getAmountNewReply')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin,Role.User)
  getAmountOfNewReplyes(@Req() request) {
    
    return this.commentsService.getAmountOfNewReply(this.authService.extractTokenFromHeader(request));
  }

  // @HttpCode(HttpStatus.OK)
  // @Get('getNewReply')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.Admin,Role.User)
  // getCommentAndReply(@Req() request) {
  //   return this.commentsService.getCommentAndReply(this.authService.extractTokenFromHeader(request));
  // }

  @HttpCode(HttpStatus.OK)
  @Get('getNewReply')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  getCommentAndReply(@Req() request, @Query('skip') skip: number, @Query('limit') limit: number ) {    
    return this.commentsService.getCommentAndReply(
      this.authService.extractTokenFromHeader(request),
      skip,
      limit
    );
  }



  @HttpCode(HttpStatus.OK)
  @Put(':commentId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateStatus(@Param('commentId') commentId: string) {
    return this.commentsService.updateStatus(commentId);
  }

  @HttpCode(HttpStatus.OK)
  @Put('updateReplyStatus/:commentId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async updateReplyStatus(@Param('commentId') commentId: string) {
    return this.commentsService.updateReplyStatus(commentId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reply')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async reply(@Body() data: any) {
    return this.commentsService.reply(data.reply, data._id);
  }


}