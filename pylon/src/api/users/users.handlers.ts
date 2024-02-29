import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../db';

import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { User, UserWithId, UserPartial, SignedURLRequestData, SignedURLResponseData, ImageURL } from "@revpub/types";
import { UserController } from './users.controller';
import { S3Controller } from "../image/image.controller";

export const Users = db.collection<User>('users');

export async function findAll(req: Request, res: Response<UserWithId[]>, next: NextFunction) {
  try {
    const users = await Users.find().toArray();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function createOne(req: Request<{}, UserWithId, User>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const insertOneResult = await UserController.insertOne(req.body);
    res.status(201);
    res.json(insertOneResult);
  } catch (error) {
    next(error);    
  }
}

export async function findOne(req: Request<ParamsWithId, UserWithId, {}>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const result = await Users.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, UserWithId, UserPartial>, res: Response<UserWithId>, next: NextFunction) {
  try {
    const result = await Users.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (result === null) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Users.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (result === null) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  } 
}

export async function getAvatarPutURL(req: Request<ParamsWithId, SignedURLResponseData, SignedURLRequestData>, res: Response<SignedURLResponseData>, next: NextFunction) {
  
  console.log("Got to updateAvatarUrl()");

  // Check if the user Id exists
  try {
    const result = await Users.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (result === null) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
  } catch (error) {
    next(error);
  }
  
  // Try to get a Put URL
  let getPutUrlResult: SignedURLResponseData = {
    category: "error",
    message: "Could not obtain Put URL"
  };

  try {
    getPutUrlResult = await S3Controller.getPutUrl(req.body);

    if (getPutUrlResult === undefined) {
      res.status(404);
      throw new Error("Could not obtain Put URL.");
    }

    if (getPutUrlResult.category !== "success") {
      res.status(404);
      throw new Error("Could not obtain Put URL.");
    }

    console.log("Got Put URL: ", getPutUrlResult.signedUrl);

  } catch (error) {
    next(error);    
  }

  res.json(getPutUrlResult);

}

export async function updateUserAvatar(req: Request<ParamsWithId, UserWithId, ImageURL>, res: Response<UserWithId>, next: NextFunction) {

  let userPartial: UserPartial = {
    avatarUrl: req.body.url,
  };

  try {
    const result = await Users.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: userPartial
    }, {
      returnDocument: 'after',
    });
    if (result === null) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }

}

export async function deleteUserAvatar(req: Request<ParamsWithId>, res: Response, next: NextFunction) {

  const userPartial: UserPartial = {
    avatarUrl: ''
  };

  try {
    const result = await Users.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: userPartial,
    }, {
      returnDocument: 'after',
    });
    if (result === null) {
      res.status(404);
      throw new Error(`User with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }

}