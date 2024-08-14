import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Courses } from 'src/Schemas/courses/courses';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/Roles/roles.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { ObjectId,Types } from 'mongoose';

@Controller('course')
export class CoursesController {

    constructor(private readonly service: CoursesService) {
    }

    @HttpCode(HttpStatus.CREATED)
    @Post('add')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async addCourse(@Body() course: Courses) {
        return await this.service.create(course);
    }


    @HttpCode(HttpStatus.OK)
    @Get('getType')
    getTypes() {
        return this.service.getCoursesType();
    }

    @HttpCode(HttpStatus.OK)
    @Get('get')
    async getCourses() {
        return await this.service.getCourses();
    }

    @HttpCode(HttpStatus.OK)
    @Get('getAll')
    async getAllCourses() {
        return await this.service.getAllCourses();
    }


    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @Roles(Role.Admin)
    deleteUser(@Param('id') id: Types.ObjectId) {
        return this.service.deleteCourse(id);
    }

}

