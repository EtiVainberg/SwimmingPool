import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
    constructor(private readonly emailService: EmailService) { }

    @Get('send')
    async sendEmail() {
        // const result = await this.emailService.sendEmail();
        // return result;
    }
}
