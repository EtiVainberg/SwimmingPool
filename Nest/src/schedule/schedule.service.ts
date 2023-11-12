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

  // 1. בדוק שהתאריך הראשון לא נמצא ביום שבת (יום 6).
  if (currentDate.getDay() === 6) {
      return false; // לא ניתן להוסיף קורס בשבת
  }

  // 2. בדוק שהשעה המשוערכת לסיום הקורס היא עד 10 בלילה (22:00).
  if (currentDate.getHours() + numHours > 22) {
      return false; // לא ניתן להוסיף קורס שמסתיים אחרי 22:00
  }

  while (currentDate <= localEndDate) {
      // נוסיף את הפונקציה הנוספת כאן שתבדוק ששעת התחלת הקורס היא בין 6 בבוקר ל-10 בלילה
      if (!this.isWithinOpeningHours(currentDate)) {
          return false; // שעת התחלת הקורס אינה בשעות הפתיחה
      }

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
          return false; // נמצאו לוזיות מתנגשות, לא ניתן להוסיף את הקורס
      }

      currentDate.setDate(currentDate.getDate() + 7); // לעבור לשבוע הבא
  }

  return true; // לא נמצאו לוזיות מתנגשות, ניתן להוסיף את הקורס
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
 

  async getByDate(date: Date) {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
    return await this.ScheduleModel.find({
      TimeBegin: { $gte: startDate, $lte: endDate },
    }).populate('Course');
  }

  
private isWithinOpeningHours(date: Date): boolean {
  const openingHour = 6;
  const closingHour = 22;

  const hour = date.getHours();

  return hour >= openingHour && hour <= closingHour;
}
  
}

