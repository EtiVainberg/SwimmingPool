import { Module } from '@nestjs/common';
import { SatisfactionService } from './satisfaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/Schemas/user.schema';
import { SatisfactionController } from './satisfaction.controller';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/Roles/roles.guard';
import { Satisfaction, SatisfactionSchema } from 'src/Schemas/satisfaction/satisfaction';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Satisfaction.name, schema: SatisfactionSchema }]),
  ],
  providers: [
    SatisfactionService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [SatisfactionService],
  controllers: [SatisfactionController],
})
export class SatisfactionModule {}
