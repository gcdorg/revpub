import { ItemWithId, Item } from '@revpub/types';
import { Items } from './item.handlers';

export class ItemController {

  public static insertOne = async (item: Item): Promise<ItemWithId> => {
    const insertResult = await Items.insertOne(item);
    if (!insertResult.acknowledged) throw new Error('Error inserting item.');
    const itemWithId: ItemWithId = {
      _id: insertResult.insertedId,
      ...item
    };
    return itemWithId;
  }

}