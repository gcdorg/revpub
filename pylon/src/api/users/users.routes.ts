import { Router } from 'express';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

import { validateRequest } from '../../middlewares';
import * as UserHandlers from './users.handlers';
import * as ImageHandlers from '../image/image.handlers';
import { User, UserPartial, SignedURLRequestData, ImageURL } from '@revpub/types';

const router = Router();

router.get('/', UserHandlers.findAll);

router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  UserHandlers.findOne,
);

router.post(
  '/',
  validateRequest({
    body: User,
  }),
  UserHandlers.createOne,
);

router.post(
  '/:id/getAvatarPutURL',
  validateRequest({
    body: SignedURLRequestData,
  }),
  UserHandlers.getAvatarPutURL
);

router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: UserPartial,
  }),
  UserHandlers.updateOne,
);

router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  UserHandlers.deleteOne,
);

router.put(
  '/:id/avatar',
  validateRequest({
    params: ParamsWithId,
    body: ImageURL
  }),
  UserHandlers.updateUserAvatar
)

router.delete(
  '/:id/avatar',
  validateRequest({
    params: ParamsWithId
  }),
  UserHandlers.deleteUserAvatar
)

export default router;