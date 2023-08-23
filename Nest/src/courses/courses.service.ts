import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment-timezone';
import { Model } from 'mongoose';
import { Courses, CoursesType, coursesDocument } from 'src/Schemas/courses/courses';
import { ScheduleService } from 'src/schedule/schedule.service';

@Injectable()
export class CoursesService {

    /**
     *
     */
    constructor(@InjectModel('Courses') private readonly CourseModel: Model<coursesDocument>, @Inject(forwardRef(() => ScheduleService)) private schedule: ScheduleService) {
    }

    async create(course: Courses) {
        if (await this.schedule.checkAddCourse(course.StartDate, course.EndDate, course.duration)) {
            let newCourse = await new this.CourseModel(course).save();
            const countMeetings = await this.schedule.addCourse(course);

            console.log(countMeetings);

            newCourse.NumberOfMeeting = countMeetings;

            // Save the updated newCourse
            newCourse = await this.CourseModel.findByIdAndUpdate(newCourse._id, newCourse, { new: true });

            console.log(newCourse.NumberOfMeeting);

            return await this.schedule
                .findByCourseId(newCourse._id)
                .then((resSchedule) => {
                    console.log(newCourse, resSchedule);

                    return [newCourse, resSchedule];
                });
        }
        else
            return false;
    }

    getCoursesType(): CoursesType[] {
        return Object.values(CoursesType);
    }

    async find_Id(course: Courses) {
        const res = await this.CourseModel.findOne(course).exec();
        if (res)
            return res._id;
    }


    async getCourses() {
        const currentDate = new Date();
        return await this.CourseModel.find({ StartDate: { $gte: currentDate } }).exec();
    }

    async checkUpdateCapacity(courseId: string) {
        try {
            const course = await this.CourseModel.findById(courseId).exec();
            if (!course) {
                // Course not found
                return false;
            }

            if (course.register < course.capacity) {
                // If there is available capacity, decrement the capacity by 1
                const updatedCourse = await this.CourseModel.findByIdAndUpdate(
                    courseId,
                    { $inc: { register: +1 } }, // Increase register by 1
                    { new: true } // To return the updated course after the update
                ).exec();

                if (updatedCourse) {
                    // Capacity updated successfully
                    return true;
                } else {
                    // Failed to update capacity
                    return false;
                }
            } else {
                // Course is already at full capacity
                return false;
            }
        } catch (error) {
            // Handle any errors that occur during the database operation
            console.error('Error:', error);
            return false;
        }
    }


}
