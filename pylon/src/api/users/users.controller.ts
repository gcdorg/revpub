import { UserWithId, User } from '@revpub/types';
import { Users } from './users.handlers';

export class UserController {

  public static insertOne = async (user: User): Promise<UserWithId> => {
    const insertResult = await Users.insertOne(user);
    if (!insertResult.acknowledged) throw new Error('Error inserting user.');
    const userWithId: UserWithId = {
      _id: insertResult.insertedId,
      ...user
    };
    return userWithId;
  }

  public static findOneByUsername = async (username: string): Promise<UserWithId> => {
    const userWithId = await Users.findOne({
      username: username
    });
    if (!userWithId) throw new Error('Error finding user by username.');
    return userWithId;
  }

}