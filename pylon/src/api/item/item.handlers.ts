import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import { db } from '../../db';

import { ParamsWithId } from '../../interfaces/ParamsWithId';
import { Item, ItemWithId, ItemPartial } from "@revpub/types";
import { ItemController } from './item.controller';

export const Items = db.collection<Item>('items');

export async function createOne(req: Request<{}, ItemWithId, Item>, res: Response<ItemWithId>, next: NextFunction) {
  try {
    const insertOneResult = await ItemController.insertOne(req.body);
    res.status(201);
    res.json(insertOneResult);
  } catch (error) {
    next(error);    
  }
}

export async function findByPossessorId(req: Request<ParamsWithId, ItemWithId[], {}>, res: Response<ItemWithId[]>, next: NextFunction) {
  try {
    const result = await Items.find({
      possessorId: new ObjectId(req.params.id),
    }).toArray();
    if (!result) {
      res.status(404);
      throw new Error(`No items for possessor id "${req.params.id}" found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function findOne(req: Request<ParamsWithId, ItemWithId, {}>, res: Response<ItemWithId>, next: NextFunction) {
  try {
    const result = await Items.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!result) {
      res.status(404);
      throw new Error(`Item with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateOne(req: Request<ParamsWithId, ItemWithId, ItemPartial>, res: Response<ItemWithId>, next: NextFunction) {
  try {
    const result = await Items.findOneAndUpdate({
      _id: new ObjectId(req.params.id),
    }, {
      $set: req.body,
    }, {
      returnDocument: 'after',
    });
    if (result === null) {
      res.status(404);
      throw new Error(`Item with id "${req.params.id}" not found.`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteOne(req: Request<ParamsWithId, {}, {}>, res: Response<{}>, next: NextFunction) {
  try {
    const result = await Items.findOneAndDelete({
      _id: new ObjectId(req.params.id),
    });
    if (result === null) {
      res.status(404);
      throw new Error(`Item with id "${req.params.id}" not found.`);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  } 
}
