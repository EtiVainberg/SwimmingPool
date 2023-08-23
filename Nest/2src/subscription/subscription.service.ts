import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from 'rxjs';
import { SubscriptionDocument, SubscriptionType, getPrice } from 'src/Schemas/subscription/subscription';
import { addMonths, addYears, addWeeks } from 'date-fns';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/users/users.service';
// import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs'
import { AuthService } from 'src/auth/auth.service';
import { log } from 'console';
// const { PDFDocument, rgb } = require('pdf-lib');
// const fs = require('fs');
@Injectable()
export class SubscriptionService {


    constructor(@InjectModel('Subscription') private readonly SubscriptionModel: Model<SubscriptionDocument>, private usersService: UsersService, private jwtService: JwtService, private authService: AuthService) { }
    async add(type: SubscriptionType, token: string) {
        console.log(type);
        
        const startDate = new Date();
        let endDate: Date;
        switch (type) {
            case SubscriptionType.Monthly:
                endDate = addMonths(startDate, 1); // Add 1 month to the current date
                break;
            case SubscriptionType.Yearly:
                endDate = addYears(startDate, 1); // Add 1 year to the current date
                break;
            case SubscriptionType.Weekly:
                endDate = addWeeks(startDate, 1); // Add 1 week to the current date
                break;
            default:
                break;
        }

        let decodedToken: { [x: string]: string; };
        decodedToken = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
        });

        const user_id = await this.usersService.findOneByEmail(decodedToken['email']);

        const newSubscribe = {
            SubscriptionType: type,
            StartDate: startDate, // Corrected property name to "StartDate"
            EndDate: endDate,
            User: user_id,
        };
        console.log(newSubscribe);

        const newUser = await new this.SubscriptionModel({
            SubscriptionType: type,
            StartDate: startDate, // Corrected property name to "StartDate"
            EndDate: endDate,
            User: user_id,
        }).save();
        return newUser;

    }

    async check(token: string) {
        try {
            const currentDate = new Date();
            const decodedToken = await this.authService.decoded(token);
            const user_id = await this.usersService.findOneByEmail(decodedToken['email']);
            const res = await this.SubscriptionModel.find({ User: user_id, EndDate: { $gt: currentDate } }).exec();
            console.log(res);

            return res.length == 1 ? true : false;
        }
        catch (error) {
            console.error('An error occurred:', error.message);
            return { success: false, error: 'Failed to check subscription' };
        }
    }


    async getPrice(type: SubscriptionType) {
        // const r = await this.splitPDF();
        // console.log(r);

        return getPrice(type); // returns 500

    }

    // async splitPDF() {
    //     // Load the existing PDF
    //     // const filePath = 'C:\\Users\\Dell Vostro\\Downloads\\קטלוג מכירה סינית עזר מציון תשפב (1)-compressed.pdf';
    //     const filePath = encodeURIComponent('C:/Users/Dell Vostro/Downloads/קטלוג מכירה סינית עזר מציון תשפב (1)-compressed.pdf');
    //     const existingPdfBytes = fs.readFileSync(filePath);
    //     console.log('ddfd');

        // Create a new PDF document
        // const pdfDoc = await PDFDocument.create();

        // Load the existing PDF document
        // const existingPdfDoc = await PDFDocument.load(existingPdfBytes);

        // Get the total number of pages in the existing PDF
        // const pageCount = existingPdfDoc.getPageCount();

        // Set the desired page range to split
        // const startPage = 1; // Replace with the start page number you want
        // const endPage = 9;   // Replace with the end page number you want

        // for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
            // Get the page from the existing PDF document
            // const page = existingPdfDoc.getPage(pageNumber - 1); // Page numbers are 0-indexed in pdf-lib

            // Create a new page in the new PDF document
            // const copiedPage = await pdfDoc.copyPages(existingPdfDoc, [pageNumber - 1]);

            // Add the copied page to the new PDF
            // pdfDoc.addPage(copiedPage[0]);
        // }

        // Serialize the new PDF document to bytes
        // const pdfBytes = await pdfDoc.save();
        // console.log(pdfBytes, 'pdf');

        // Write the new PDF bytes to a new file
        // fs.writeFileSync('C:/Users/Dell Vostro/Downloads/19.pdf', pdfBytes);
    // }
}
