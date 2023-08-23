import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Enrollment, EnrollmentSchema } from 'src/Schemas/Enrollment/enrollment';
import { EnrollmentService } from './enrollment.service';
import { EnrollementController } from './enrollment.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/Roles/roles.guard';

@Module({
    imports: [MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }])],
    providers: [EnrollmentService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [EnrollmentService],
    controllers: [EnrollementController],
})
export class EnrollementModule {

}
