import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from 'src/users/users.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, UserSchema } from '../Schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from '../auth/auth.controller';
import { UsersController } from '../users/users.controller';
import { PaymentDetailsController } from '../payment-details/payment-details.controller';
import { PaymentDetailsService } from 'src/payment-details/payment-details.service';
import { PaymentDetailsModule } from 'src/payment-details/payment-details.module';
import { CreditDetails, CreditDetailsSchema } from 'src/Schemas/credit-details.schema';
import { CoursesService } from 'src/courses/courses.service';
import { CoursesController } from 'src/courses/courses.controller';
import { ScheduleController } from 'src/schedule/schedule.controller';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Schedule, ScheduleSchema } from 'src/Schemas/schedule/schedule';
import { CourseSchema, Courses, CoursesType } from 'src/Schemas/courses/courses';
import { CoursesModule } from 'src/courses/courses.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { SubscriptionController } from 'src/subscription/subscription.controller';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { Subscription, SubscriptionSchema } from 'src/Schemas/subscription/subscription';
import { SatisfactionService } from 'src/Satisfaction/satisfaction.service';
import { SatisfactionModule } from 'src/Satisfaction/satisfaction.module';
import { SatisfactionController } from 'src/Satisfaction/satisfaction.controller';
import { CommentsController } from 'src/Comments/comments.controller';
import { CommentsModule } from 'src/Comments/comments.module';
import { CommentsService } from 'src/Comments/comments.service';
import { Satisfaction, SatisfactionSchema } from 'src/Schemas/satisfaction/satisfaction';
import { CommentSchema, Comments } from 'src/Schemas/comments/comments';
import { Enrollment, EnrollmentSchema } from 'src/Schemas/Enrollment/enrollment';
import { EnrollmentService } from 'src/enrollement/enrollment.service';
import { EnrollementController } from 'src/enrollement/enrollment.controller';
import { EnrollementModule } from 'src/enrollement/enrollment.module';
import { EmailService } from 'src/email/email.service';
import { EmailModule } from 'src/email/email.module';
import { EmailController } from 'src/email/email.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: CreditDetails.name, schema: CreditDetailsSchema }]),
    MongooseModule.forFeature([{ name: Schedule.name, schema: ScheduleSchema }]),
    MongooseModule.forFeature([{ name: Courses.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
    MongooseModule.forFeature([{ name: Satisfaction.name, schema: SatisfactionSchema }]),
    MongooseModule.forFeature([{ name: Comments.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
  ],
  controllers: [AppController, AuthController, UsersController, PaymentDetailsController, CoursesController, ScheduleController, SubscriptionController, SatisfactionController, CommentsController, EnrollementController,EmailController],
  providers: [CoursesService, AppService, UsersModule, UsersService, JwtService, AuthService,
    PaymentDetailsService, PaymentDetailsModule,
    CoursesModule, ScheduleModule, CoursesService, ScheduleService, SubscriptionModule,
    SubscriptionService, SatisfactionService,
    SatisfactionModule, CommentsModule, CommentsService, EnrollmentService, EnrollementModule,EmailService,EmailModule],
})
export class AppModule {
}
