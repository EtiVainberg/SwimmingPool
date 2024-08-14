import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schedule, ScheduleSchema } from 'src/Schemas/schedule/schedule';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
// import { CoursesService } from 'src/courses/courses.service';
// import { CoursesModule } from 'src/courses/courses.module';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }])
    ],
    providers: [ScheduleService],
    exports: [ScheduleService],
    controllers: [ScheduleController],
})
export class ScheduleModule { }