import { ObjectId } from 'mongodb';
import * as z from 'zod';

const actorIdDefinedSchema = z.object({
  actorId: z.string().min(1).refine((val) => {
    try {
      return new ObjectId(val);
    } catch (error) {
      return false;
    }
  }, {
    message: 'Invalid ObjectId',
  })
});

export const ActorId = actorIdDefinedSchema;

export type ActorId = z.infer<typeof actorIdDefinedSchema>;