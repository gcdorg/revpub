import * as z from 'zod';
import { ObjectId } from 'bson';

export const Item = z.object({
  itemName: z.string().min(1),
  providerName: z.string().min(1),
  producerName: z.string().min(1),
  possessorId: z.instanceof(ObjectId).or( z.string().transform( ObjectId.createFromHexString ) ),
});

export const ItemWithId = Item.extend({
  _id: z.instanceof(ObjectId)
});

export const ItemPartial = Item.partial();

export const ItemPartialWithId = ItemPartial.extend({
  _id: z.instanceof(ObjectId)
});

export type Item = z.infer<typeof Item>;
export type ItemWithId = z.infer<typeof ItemWithId>;
export type ItemPartial = z.infer<typeof ItemPartial>;
export type ItemPartialWithId = z.infer<typeof ItemPartialWithId>;
