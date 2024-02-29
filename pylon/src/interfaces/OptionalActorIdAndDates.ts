import { ObjectId } from 'mongodb';
import * as z from 'zod';

const actorIdAndDatesDefinedSchema = z.object({
  actorId: z.string().min(1).refine((val) => {
    try {
      return new ObjectId(val);
    } catch (error) {
      return false;
    }
  }, {
    message: 'Invalid ObjectId',
  }),
  startDate: z.string(),
  endDate: z.string()
});

const actorIdAndDatesUndefinedSchema = z.object({
  actorId: z.undefined(),
  startDate: z.undefined(),
  endDate: z.undefined()
});

export const OptionalActorIdAndDates = actorIdAndDatesDefinedSchema.or(actorIdAndDatesUndefinedSchema);

export type OptionalActorIdAndDates = z.infer<typeof OptionalActorIdAndDates>;