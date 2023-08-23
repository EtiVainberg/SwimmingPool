import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Enrollment } from "../Enrollment/enrollment";

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

    @Prop({ required: true })
    TeacherName: string;

    @Prop({ required: true })
    NumberOfMeeting: number;

    @Prop({ required: true })
    CoursesType: CoursesType;

    @Prop({ required: true })
    Gender: Gender;

    @Prop({ required: true })
    StartDate: Date;

    @Prop({ required: true })
    EndDate: Date;

    @Prop({ required: true })
    duration: number;

    @Prop({ required: true })
    price: number;

    @Prop({ required: false, default: 100 })
    capacity: number;

    @Prop({ required: false, default: 0 })
    register: number;
}

export const CourseSchema = SchemaFactory.createForClass(Courses);