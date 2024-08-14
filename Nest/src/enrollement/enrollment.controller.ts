import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/Roles/roles.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { Types } from 'mongoose';
import { Courses } from 'src/Schemas/courses/courses';

@Controller('enrollement')
export class EnrollementController {

    /**
     *
     */
    constructor(private readonly EnrollmentService: EnrollmentService, private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post(':courseId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    async enrollUserToCourse(@Param('courseId') courseId: Types.ObjectId, @Req() request) {
        try {
            const updatedCourse = await this.EnrollmentService.registerUserToCourse(this.authService.extractTokenFromHeader(request), courseId);
            return { course: updatedCourse };
        } catch (error) {
            return { error: error.message };
        }
    }


    @Get(':courseId')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.User)
    async checkEnrollment(@Param('courseId') courseId: Types.ObjectId, @Req() request) {
        try {
            return await this.EnrollmentService.checkEnrollment(this.authService.extractTokenFromHeader(request), courseId);
        } catch (error) {
            return { error: error.message };
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    async getEnrollments(@Query('courseId') courseId: Types.ObjectId, @Req() request) {
        try {
            return await this.EnrollmentService.getCourseEnrollment(courseId);
        } catch (error) {
            return { error: error.message };
        }
    }


}
