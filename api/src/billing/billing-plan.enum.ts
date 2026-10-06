import { registerEnumType } from '@nestjs/graphql';
import { BillingPlan } from '@prisma/client';

registerEnumType(BillingPlan, { name: 'BillingPlan' });

export { BillingPlan };
