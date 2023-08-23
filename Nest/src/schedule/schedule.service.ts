import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { scheduled } from 'rxjs';
import { Courses } from 'src/Schemas/courses/courses';
import { Schedule, ScheduleDocument } from 'src/Schemas/schedule/schedule';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class ScheduleService {


  constructor(@InjectModel('Schedule') private readonly ScheduleModel: Model<ScheduleDocument>, @Inject(forwardRef(() => CoursesService)) private courseService: CoursesService) { }

  async checkAddCourse(startDate: Date, endDate: Date, numHours: number): Promise<boolean> {
    const currentDate = new Date(startDate);
    const localEndDate = new Date(endDate);

    console.log(startDate, currentDate, endDate, localEndDate);

    while (currentDate <= localEndDate) {
      const dayOfWeek = currentDate.getDay();

      const schedules = await this.ScheduleModel.find({
        $or: [
          {
            $and: [
              { TimeBegin: { $lte: currentDate } },
              { TimeEnd: { $gt: currentDate } }
            ]
          },
          {
            $and: [
              { TimeBegin: { $lt: new Date(currentDate.getTime() + numHours * 60 * 60 * 1000) } },
              { TimeEnd: { $gt: currentDate } }
            ]
          },
          {
            $and: [
              { TimeBegin: { $lte: currentDate } },
              { TimeEnd: { $gte: new Date(currentDate.getTime() + numHours * 60 * 60 * 1000) } }
            ]
          }
        ]
      }).exec();

      if (schedules.length > 0) {
        return false; // Overlapping schedule found, return false
      }

      currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
    }

    return true; // No overlapping schedules found, return true
  }

  async addCourse(course: Courses) {
    const startDate = new Date(course.StartDate);
    const endDate = new Date(course.EndDate);

    const currentDate = new Date(startDate);
    const course_id = (await this.courseService.find_Id(course));

    let count = 0;
    while (currentDate <= endDate) {
      if (currentDate.getDay() === startDate.getDay()) {
        const newSchedule: Schedule = {
          TimeBegin: currentDate,
          TimeEnd: new Date(currentDate.getTime() + course.duration * 60 * 60 * 1000),
          Course: course_id// Assuming the course ID is stored in the '_id' property
        };
        await new this.ScheduleModel(newSchedule).save() ? count++ : count;
      }
      currentDate.setDate(currentDate.getDate() + 7); // Move to the next Monday
    }

    return count;
  }

  async findByCourseId(_id: Types.ObjectId) {
    return await this.ScheduleModel.find({ Course: _id });
  }
  // async getByDate(date: Date) {
  //   const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  //   const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  //   return await this.ScheduleModel.find({
  //     TimeBegin: { $gte: startDate, $lte: endDate }
  //   });
  // }

  async getByDate(date: Date) {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
    return await this.ScheduleModel.find({
      TimeBegin: { $gte: startDate, $lte: endDate },
    }).populate('Course');
  }
  
}

