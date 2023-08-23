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

// import { Injectable } from '@nestjs/common';
// import * as mailgun from 'mailgun-js';

// @Injectable()
// export class EmailService {
//     private mg: mailgun.Mailgun;

//     constructor() {
//         this.mg = mailgun({
//             apiKey: '7418027a6ca9be4a03e508fd9f352787-f0e50a42-68d048ec',
//             domain: 'sandboxe0b41226f3f24746a80950d67b608f48.mailgun.org', // This should be your Mailgun domain
//         });
//     }

//     async sendEmail() {
//         const data = {
//             from: 'Excited User <mailgun@sandboxe0b41226f3f24746a80950d67b608f48.mailgun.org>',
//             to: 'e0533180664@gmail.com',
//             subject: 'Hello',
//             text: 'Testing some Mailgun awesomeness!',
//             html: '<h1>Testing some Mailgun awesomeness!</h1>',
//         };

//         try {
//             const msg = await this.mg.messages.create('sandbox-123.mailgun.org', data);
//             return msg;
//         } catch (err) {
//             console.error(err);
//             throw err;
//         }
//     }
// }

// const API_KEY = '7418027a6ca9be4a03e508fd9f352787-f0e50a42-68d048ec';
// const DOMAIN = 'sandboxe0b41226f3f24746a80950d67b608f48.mailgun.org';

// import formData from 'form-data';
// import Mailgun from 'mailgun.js';


// // @Injectable()
// // export class EmailService {
// const mailgun = new Mailgun(formData);
// const client = mailgun.client({ username: 'api', key: API_KEY });

// const messageData = {
//     from: 'Excited User <me@samples.mailgun.org>',
//     to: 'dasi375875@gmail.com,e0533180664@gmail.com',
//     subject: 'Hello',
//     text: 'Testing some Mailgun awesomeness!',
//     html: '<h1>Testing some Mailgun awesomeness!</h1>',

// };

// client.messages.create(DOMAIN, messageData)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.error(err);
//     });import { Injectable } from '@nestjs/common';
// import { Injectable } from '@nestjs/common';
// import * as mailgun from 'mailgun-js';

// @Injectable()
// export class EmailService {
    // private mg: mailgun.Mailgun;

    // constructor() {
    //     const API_KEY = 'your-mailgun-api-key'; // Replace with your Mailgun API key
    //     const DOMAIN = 'your-mailgun-domain';   // Replace with your Mailgun domain

    //     this.mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

    //     this.sendEmail();
    // }

    // async sendEmail() {
    //     const data = {
    //         from: 'Excited User <me@samples.mailgun.org>',
    //         to: 'dasi375875@gmail.com,e0533180664@gmail.com',
    //         subject: 'Hello',
    //         text: 'Testing some Mailgun awesomeness!',
    //         html: '<h1>Testing some Mailgun awesomeness!</h1>',
    //     };

    //     try {
    //         const msg = await this.mg.messages.create(DOMAIN, data);
    //         console.log(msg);
    //         return msg;
    //     } catch (err) {
    //         console.error(err);
    //         throw err;
    //     }
    // }
// }
