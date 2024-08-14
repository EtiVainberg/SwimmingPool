// users.service.ts
import { BadRequestException, ConflictException, Inject, Injectable, MisdirectedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/Schemas/user.schema'; // Import your user schema types
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { Role } from '../roles/role.enum';
import { jwtConstants } from 'src/auth/constants';
import { EnrollmentService } from 'src/enrollement/enrollment.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SatisfactionService } from 'src/Satisfaction/satisfaction.service';
import { CoursesService } from 'src/courses/courses.service';
import { Satisfaction } from 'src/Schemas/satisfaction/satisfaction';
import { Email } from 'src/Schemas/Email/Email';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel('User') private readonly UserModel: Model<UserDocument>,
        private jwtService: JwtService,
        private courseService: CoursesService,
        private subscriptionService: SubscriptionService,
        @Inject(forwardRef(() => SatisfactionService)) private satisfactionService: SatisfactionService,
        @Inject(forwardRef(() => AuthService)) private authService: AuthService,
        @Inject(forwardRef(() => EnrollmentService)) private enrollmentService: EnrollmentService
    ) { }

    async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.UserModel.findOne({ email: email }).exec();
    }

    async findOne(user: User): Promise<User | undefined> {
        return await this.UserModel.findOne({ email: user.email }).exec();
    }

    async findOneByEmail(email: string): Promise<User | undefined> {
        const ans = await (this.UserModel.findOne({ email: email }).exec());
        return ans._id;
    }

    async findOneByEmail2(email: string): Promise<User | undefined> {
        const ans = await (this.UserModel.findOne({ email: email }).exec());
        return ans.id;
    }

    async hashPassword(user: any) {
        const { password } = user;
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);

        const reqUser = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            password: hashedPassword,
            role: Role.User
        }
        return reqUser;
    }

    async create(user: User) {
        const found = await this.findOne(user);
        if (found != null)
            throw new ConflictException("User already exists");
        const reqUser = await this.hashPassword(user);
        const newUser = await new this.UserModel(reqUser).save();
        const payload = { email: newUser.email, password: newUser.password, role: reqUser.role };
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '6h',
            secret: jwtConstants.secret, // Secret key for JWT
        });
        return [access_token, payload.role];
    }

    async getUsers() {
        return await this.UserModel.find().exec();
    }

    async getUserDetails(token: string) {
        const decodedToken = await this.authService.decoded(token);
        return await this.findUserByEmail(decodedToken['email']);
    }

    async update(token: string, updatedUser: any) {
        console.log(updatedUser);
        if (updatedUser?.id != null) {
            console.log('hh');
            updatedUser.password = (await this.UserModel.findById(updatedUser.id))?.password;
            console.log(updatedUser.password);

            const updatedUser1 = await this.UserModel.findByIdAndUpdate(
                updatedUser.id,
                { $set: updatedUser },
                { new: true }
            );
            console.log(updatedUser1);

            return updatedUser1;
        }

        const decodedToken = await this.authService.decoded(token);
        const user = await this.findUserByEmail(decodedToken['email']);
        try {
            const passwordMatch = await new Promise<boolean>((resolve, reject) => {
                bcrypt.compare(updatedUser.prevPassword, user.password, (err, result) => {
                    if (err) {
                        reject(err); // Reject the promise on error
                    } else if (result) {
                        resolve(true); // Resolve the promise if passwords match
                    } else {
                        resolve(false); // Resolve the promise if passwords don't match
                    }
                });
            });

            if (!passwordMatch) {
                throw new BadRequestException();
            }

            const user_id = await this.findOneByEmail(decodedToken['email']);
            const reqUser = await this.hashPassword(updatedUser);
            return await this.UserModel.findByIdAndUpdate(
                user_id,
                { $set: reqUser },
                { new: true }
            );
        } catch (error) {
            throw new BadRequestException();
        }
    }

    async getUserById(_id) {
        return await this.UserModel.find({ _id: _id }).exec();
    }

    async getAllUserDetails(email: string) {
        const user_id = await this.findOneByEmail(email);
        const enrollments = await this.enrollmentService.findByUserId(user_id);
        const adaptedCourses = await Promise.all(
            enrollments?.map(async (enrollment) => {
                const courseId = enrollment.course;
                const course = await this.courseService.findById(courseId);
                return {
                    _id: course?._id,
                    TeacherName: course?.TeacherName,
                    CoursesType: course.CoursesType,
                    StartDate: course.StartDate,
                    EndDate: course.EndDate,
                    registerDate: enrollment.registrationDate,
                };
            })
        );

        const subscription = await this.subscriptionService.getDetails(user_id);
        const satisfaction = await this.satisfactionService.find(user_id);

        satisfaction?.map(async (s: Satisfaction) => {

            return {
                Service: s.Service,
                Availability: s.Availability,
                Cleanly: s.Cleanly,
                lessons: s.lessons,
                Staff: s.Staff,
            };
        })
        return { adaptedCourses, subscription, satisfaction };
    }


    async deleteUser(id: string) {
        const userDeleteFromCourse = await this.enrollmentService.deleteUser(id);

        if (userDeleteFromCourse) {
            console.log('ss');

            return await this.UserModel.findByIdAndDelete(id);
        }
    }
}

