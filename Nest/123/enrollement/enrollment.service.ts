// import { HttpStatus, Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { EnrollmentDocument } from 'src/Schemas/Enrollment/enrollment';
// import { AuthService } from 'src/auth/auth.service';
// import { CoursesService } from 'src/courses/courses.service';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class EnrollmentService {
//     /**
//      *
//      */
//     constructor(@InjectModel('Enrollment') private readonly enrollmentModel: Model<EnrollmentDocument>, private authService: AuthService, private readonly userService: UsersService, private courseService: CoursesService) { }

//     async registerUserToCourse(token: string, courseId: string) {
//         try {
//             const decodedToken = await this.authService.decoded(token);
//             const user_id = await this.userService.findOneByEmail(decodedToken['email']);
//             if (user_id) {
//                 const existingEnrollment = await this.enrollmentModel.findOne({ user: user_id, course: courseId }).exec();
//                 if (existingEnrollment) {                    
//                     return { success: false, message: 'User is already enrolled in this course', status: HttpStatus.CONFLICT };
//                 }
//                 const res = await this.courseService.checkUpdateCapacity(courseId);
//                 if (res) {
//                     const currentDate = new Date();
//                     const enrollment = new this.enrollmentModel({
//                         user: user_id, // Pass the user_id to the user field
//                         course: courseId, // Pass the courseId to the course field
//                         registrationDate: currentDate, // Pass the currentDate to the registrationDate field
//                     });
//                     await enrollment.save();
//                     const savedEnrollment = await this.enrollmentModel.findById(enrollment._id).exec();
//                     if (savedEnrollment) {
//                         return { success: true, message: 'Enrollment successful', enrollment: savedEnrollment, status: HttpStatus.CREATED };
//                     } else {
//                         throw new Error('Failed to retrieve the saved enrollment');
//                     }
//                 } else {
//                     return { success: false, message: 'Course capacity is full', status: HttpStatus.BAD_REQUEST };
//                 }
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             throw error;
//         }
//     }
// }
// import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import mongoose, { Model } from 'mongoose';
// import { EnrollmentDocument } from 'src/Schemas/Enrollment/enrollment';
// import { User } from 'src/Schemas/user.schema';
// import { AuthService } from 'src/auth/auth.service';
// import { CoursesService } from 'src/courses/courses.service';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class EnrollmentService {
//     /**
//      *
//      */
//     constructor(
//         @InjectModel('Enrollment') private readonly enrollmentModel: Model<EnrollmentDocument>,
//         private authService: AuthService,
//         @Inject(forwardRef(() => UsersService)) private userService: UsersService,
//         private courseService: CoursesService) { }

//     async registerUserToCourse(token: string, courseId: string) {
//         try {
//             const decodedToken = await this.authService.decoded(token);
//             const user_id = await this.userService.findOneByEmail(decodedToken['email']);
//             if (user_id) {
//                 const existingEnrollment = await this.enrollmentModel.findOne({ user: user_id, course: courseId }).exec();
//                 if (existingEnrollment) {
//                     return { success: false, message: 'User is already enrolled in this course', status: HttpStatus.CONFLICT };
//                 }
//                 const res = await this.courseService.checkUpdateCapacity(courseId);
//                 if (res) {
//                     const currentDate = new Date();
//                     const enrollment = new this.enrollmentModel({
//                         user: user_id, // Pass the user_id to the user field
//                         course: new mongoose.Types.ObjectId(courseId), // Pass the courseId to the course field
//                         registrationDate: currentDate, // Pass the currentDate to the registrationDate field
//                     });
//                     await enrollment.save();
//                     const savedEnrollment = await this.enrollmentModel.findById(enrollment._id).exec();
//                     if (savedEnrollment) {
//                         return { success: true, message: 'Enrollment successful', enrollment: savedEnrollment, status: HttpStatus.CREATED };
//                     } else {
//                         throw new Error('Failed to retrieve the saved enrollment');
//                     }
//                 } else {
//                     return { success: false, message: 'Course capacity is full', status: HttpStatus.BAD_REQUEST };
//                 }
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             throw error;
//         }
//     }

//     async findByUserId(user_id: Object | User) {

//         return (await this.enrollmentModel.find({ user: user_id }).exec());
//     }
// }
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnrollmentDocument } from 'src/Schemas/Enrollment/enrollment';
import { AuthService } from 'src/auth/auth.service';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import mongoose from 'mongoose';

@Injectable()
export class EnrollmentService {
    constructor(@InjectModel('Enrollment') private readonly enrollmentModel: Model<EnrollmentDocument>, private authService: AuthService, private readonly userService: UsersService, private courseService: CoursesService) { }

    async registerUserToCourse(token: string, courseId: string) {
        try {
            const decodedToken = await this.authService.decoded(token);
            const user_id = await this.userService.findOneByEmail(decodedToken['email']);
            if (user_id) {
                const existingEnrollment = await this.enrollmentModel.findOne({ user: user_id, course: courseId }).exec();
                if (existingEnrollment) {                    
                    return { success: false, message: 'User is already enrolled in this course', status: HttpStatus.CONFLICT };
                }
                const res = await this.courseService.checkUpdateCapacity(new mongoose.Types.ObjectId(courseId));
                if (res) {
                    const currentDate = new Date();
                    const enrollment = new this.enrollmentModel({
                        user: user_id,
                        course: new mongoose.Types.ObjectId(courseId),
                        registrationDate: currentDate,
                    });
                    await enrollment.save();
                    const savedEnrollment = await this.enrollmentModel.findById(enrollment._id).exec();
                    if (savedEnrollment) {
                        return { success: true, message: 'Enrollment successful', enrollment: savedEnrollment, status: HttpStatus.CREATED };
                    } else {
                        throw new Error('Failed to retrieve the saved enrollment');
                    }
                } else {
                    return { success: false, message: 'Course capacity is full', status: HttpStatus.BAD_REQUEST };
                }
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
}
