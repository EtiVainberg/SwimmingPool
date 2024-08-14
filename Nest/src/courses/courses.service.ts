import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model, ObjectId, Types } from 'mongoose';
import { Courses, CoursesType, coursesDocument } from 'src/Schemas/courses/courses';
import { EmailService } from 'src/email/email.service';
import { EnrollmentService } from 'src/enrollement/enrollment.service';
import { ScheduleService } from 'src/schedule/schedule.service';
@Injectable()
export class CoursesService {

    constructor(@InjectModel('Courses') private readonly CourseModel: Model<coursesDocument>,
        @Inject(forwardRef(() => ScheduleService)) private schedule: ScheduleService,
        @Inject(forwardRef(() => EnrollmentService)) private enrollment: EnrollmentService,
        private readonly email: EmailService
    ) {
    }

    async create(course: Courses) {
        if (await this.schedule.checkAddCourse(course.StartDate, course.EndDate, course.duration)) {
            let newCourse = await new this.CourseModel(course).save();
            const countMeetings = await this.schedule.addCourse(course);

            newCourse.NumberOfMeeting = countMeetings;

            // Save the updated newCourse
            newCourse = await this.CourseModel.findByIdAndUpdate(newCourse._id, newCourse, { new: true });

            return await this.schedule
                .findByCourseId(newCourse._id)
                .then((resSchedule) => {

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

    async findById(courseId: any) {

        return (await this.CourseModel.findById(courseId));
    }

    async getCourses() {
        const currentDate = new Date();
        return await this.CourseModel.find({ StartDate: { $gte: currentDate } }).exec();
    }

    async getAllCourses() {
        this.schedule.checkEnrollmentsForNextDay();

        return await this.CourseModel.find().exec();
    }

    async checkUpdateCapacity(courseId: Types.ObjectId) {
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


    async deleteCourse(id: Types.ObjectId) {
        let users = [];
        let _id: Types.ObjectId;

        try {
            // Find the course by ID
            const course = (await this.CourseModel.findById(id).exec());

            if (course == null) {
                throw new Error('Course not found');
            }

            // Start deleting related data
            await this.schedule.deleteCourse(course._id);
            users = await this.enrollment.deleteEnrollment(id);

            // Delete the course
            let deletedCourse = await this.CourseModel
                .findByIdAndDelete(id)
                .exec();

            // Send email notifications if enrollments were canceled
            if (users.length > 0) {
                await this.email.sendEmailCanceledCourse(users, deletedCourse.CoursesType);
            }

            return { success: true, message: 'Course deleted successfully' };
        } catch (error) {
            return new Error(`Failed to delete course: ${error.message}`);
        }
    }

}