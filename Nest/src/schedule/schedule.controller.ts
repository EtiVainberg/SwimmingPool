import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/Roles/Role.enum';
import { Roles } from 'src/Roles/roles.decorator';
import { RolesGuard } from 'src/Roles/roles.guard';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {

    /**
     *
     */
    constructor(private readonly service: ScheduleService) {

    }
    @HttpCode(HttpStatus.OK)
    @Get('get')
    async getCourses(@Query('date') date: string) {
        return await this.service.getByDate(new Date(date));
    }

    @Get('start-job')
    startScheduledJob() {
        this.service.startScheduledJob();
        return 'Scheduled job started.';
    }
}
