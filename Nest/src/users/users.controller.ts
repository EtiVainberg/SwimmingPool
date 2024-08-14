import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/Schemas/user.schema';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { RolesGuard } from 'src/Roles/roles.guard';
import { AuthService } from 'src/auth/auth.service';


@Controller('/')
export class UsersController {
    constructor(private usersService: UsersService, private readonly authService: AuthService) {
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() user: User) {
        return await this.usersService.create(user);
    }

    @HttpCode(HttpStatus.OK)
    @Get('users')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    getUsers() {
        return this.usersService.getUsers();
    }

    @HttpCode(HttpStatus.OK)
    @Get('isManager')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    isManager() { }

    @HttpCode(HttpStatus.OK)
    @Get('userDetails')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    getUserDetails(@Req() request: any) {
        return this.usersService.getUserDetails(this.authService.extractTokenFromHeader(request));
    }

    @Put('update')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    updateUserDetails(@Body('userDetails') user: any, @Req() request: any) {
        console.log(user);

        return this.usersService.update(this.authService.extractTokenFromHeader(request), user);
    }

    @HttpCode(HttpStatus.OK)
    @Get('getById')
    @Roles(Role.Admin)
    getUserById(@Body('_id') _id: String) {
        return this.usersService.getUserById(_id);
    }

    @HttpCode(HttpStatus.OK)
    @Get('getAllUserDetails')
    @Roles(Role.Admin)
    getAllUserDetails(@Query('email') email: string) {
        return this.usersService.getAllUserDetails(email);
    }


    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @Roles(Role.Admin)
    deleteUser(@Param('id') id: string) {
        console.log('ui', id);

        return this.usersService.deleteUser(id);
    }
}
