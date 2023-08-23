import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema, Courses } from 'src/Schemas/courses/courses';
import { CoursesService } from './courses.service';
import { RolesGuard } from 'src/Roles/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { CoursesController } from './courses.controller';
import { JwtService } from '@nestjs/jwt';
import { ScheduleService } from 'src/schedule/schedule.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Courses.name, schema: CourseSchema }])],
    providers: [CoursesService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: [CoursesService],
    controllers: [CoursesController],
})
export class CoursesModule {

}
