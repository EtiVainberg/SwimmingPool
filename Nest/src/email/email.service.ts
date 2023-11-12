import { Injectable } from '@nestjs/common';
import * as mailgun from 'mailgun-js';

@Injectable()
export class EmailService {
    private mg: mailgun.Mailgun;

    constructor() {
        this.mg = mailgun({ apiKey: `7418027a6ca9be4a03e508fd9f352787-f0e50a42-68d048ec`, domain: 'your-domain.com' });
    }

    async sendEmail() {
        const data = {
            from: 'Excited User <mailgun@your-domain.com>',
            to: 'e0533180664@gmail.com',
            subject: 'Hello',
            text: 'Testing some Mailgun awesomeness!',
            html: '<h1>Testing some Mailgun awesomeness!</h1>',
        };

        try {
            const msg = await this.mg.messages.create('your-domain.com', data);
            return msg;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}
