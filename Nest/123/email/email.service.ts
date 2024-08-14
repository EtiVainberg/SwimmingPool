// import { Injectable } from '@nestjs/common';
// import * as mailgun from 'mailgun-js';

// @Injectable()
// export class EmailService {
//     private mg: mailgun.Mailgun;

//     constructor() {
//         this.mg = mailgun({ apiKey: `7418027a6ca9be4a03e508fd9f352787-f0e50a42-68d048ec`, domain: 'your-domain.com' });
//     }

//     async sendEmail() {
//         const data = {
//             from: 'Excited User <mailgun@your-domain.com>',
//             to: 'e0533180664@gmail.com',
//             subject: 'Hello',
//             text: 'Testing some Mailgun awesomeness!',
//             html: '<h1>Testing some Mailgun awesomeness!</h1>',
//         };

//         try {
//             const msg = await this.mg.messages.create('your-domain.com', data);
//             return msg;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     }
// }
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    constructor() { }

    public async sendEmail(to: string,name:string,course:string, time: Date): Promise<void> {
        try {
            
            // Create a transporter with Gmail SMTP service (Make sure to use a Gmail account with "less secure apps" enabled)
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'paradisepool232@gmail.com',
                    pass: 'chyjbntzrtqnzjav',
                },
                secure: false, // Set secure to false
                tls: {
                    rejectUnauthorized: false, // Set rejectUnauthorized to false
                },
            });

            // Send the email
            await transporter.sendMail({
                to: to,
                subject: 'Reminder About Your Course',
                text: 'Your email content here', // Plain text content
                html: `<b>Hi ${name},<br/> 
                We want to remind you- about your ${course}<br/>
                At ${time} tommorrow.<br/>
                 See You....</b>`, // HTML content
            });

            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}