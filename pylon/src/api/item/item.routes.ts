import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { validateRequest } from '../../middlewares';
import * as ItemHandlers from './item.handlers';
import { Item, ItemPartial } from '@revpub/types';

const router = Router();

router.get(
  '/itemsByPossessorId/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  ItemHandlers.findByPossessorId,
);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  ItemHandlers.findOne,
);

router.post(
  '/',
  validateRequest({
    body: Item,
  }),
  ItemHandlers.createOne,
);

router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: ItemPartial,
  }),
  ItemHandlers.updateOne,
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  ItemHandlers.deleteOne,
);

export default router;