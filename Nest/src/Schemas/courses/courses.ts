import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Enrollment } from "../Enrollment/enrollment";
import { ApiProperty } from "@nestjs/swagger";

export type coursesDocument = Courses & Document;

export enum CoursesType {
    Begginners = 'Begginners',
    Advanced = 'AdvancedSwimming',
    Hydrotherapy = "Hydrotherapy",
    WaterExercise = "water-exercise",
    TherapeuticSwimming = "TherapeuticSwimming",
    LifeguardStudie = "LifeguardStudie",
    FreeSwimming = "free swimming",
    SwimmingForSubscribers = "SwimmingForSubscribers"
}

export enum Gender {
    Male = 'Male',
    Female = 'Female',
}
@Schema()
export class Courses {


    @ApiProperty()
    @Prop({ required: true })
    TeacherName: string;
    
    @ApiProperty()
    @Prop({ required: true })
    NumberOfMeeting: number;

    @ApiProperty()
    @Prop({ required: true })
    CoursesType: CoursesType;

    @ApiProperty()
    @Prop({ required: true })
    Gender: Gender;

    @ApiProperty()
    @Prop({ required: true })
    StartDate: Date;

    @ApiProperty()
    @Prop({ required: true })
    EndDate: Date;

    @ApiProperty()
    @Prop({ required: true })
    duration: number;

    @ApiProperty()
    @Prop({ required: true })
    price: number;

    @ApiProperty()
    @Prop({ required: false, default: 100 })
    capacity: number;

    @ApiProperty()
    @Prop({ required: false, default: 0 })
    register: number;
}

export const CourseSchema = SchemaFactory.createForClass(Courses);