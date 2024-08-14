import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreditDetails, CreditDetailsSchema } from 'src/Schemas/credit-details.schema';
import { PaymentDetailsService } from './payment-details.service';
import { PaymentDetailsController } from './payment-details.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: CreditDetails.name, schema: CreditDetailsSchema }])],
    providers: [PaymentDetailsService],
    exports: [PaymentDetailsService],
    controllers: [PaymentDetailsController],
})
export class PaymentDetailsModule {

}
