import { Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/Roles/roles.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';

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
    async enrollUserToCourse(@Param('courseId') courseId: string, @Req() request) {
        try {
            const updatedCourse = await this.EnrollmentService.registerUserToCourse(this.authService.extractTokenFromHeader(request), courseId);
            return { course: updatedCourse };
        } catch (error) {
            return { error: error.message };
        }
    }
}
