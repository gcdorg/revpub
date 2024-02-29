import * as z from 'zod';
import { ObjectId } from 'bson';

export const User = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  avatarUrl: z.string().min(1).optional()
});

export const UserWithId = User.extend({
  _id: z.instanceof(ObjectId)
});

export const UserPartial = User.partial();

export const UserPartialWithId = UserPartial.extend({
  _id: z.instanceof(ObjectId)
});

export type User = z.infer<typeof User>;
export type UserWithId = z.infer<typeof UserWithId>;
export type UserPartial = z.infer<typeof UserPartial>;
export type UserPartialWithId = z.infer<typeof UserPartialWithId>;
