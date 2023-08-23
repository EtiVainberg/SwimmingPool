import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Put, Req,
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
    console.log(data);

    return this.commentsService.create(data, this.authService.extractTokenFromHeader(request));
  }

  @HttpCode(HttpStatus.OK)
  @Get('get')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  get() {
    return this.commentsService.get();
  }


  @HttpCode(HttpStatus.NO_CONTENT )
  @Put(':user_id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateStatus(@Param('user_id') user_id: string) {
    return this.commentsService.updateStatus(user_id);
  }



}
