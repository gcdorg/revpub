import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import users from './users/users.routes';
import items from './item/item.routes';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/users', users);
router.use('/items', items);

export default router;
