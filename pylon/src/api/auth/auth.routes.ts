import { Router, Request, Response, NextFunction } from 'express';
import authController from "./auth.controller";
import { UserController } from '../users/users.controller';
import { UserWithId } from '@revpub/types';
import { ObjectId } from 'mongodb';

export const router = Router();

router.post("/createUser", async (req: Request, res: Response, next: NextFunction) => {

  const password: string = req.body.password;
  const hashedPassword: string = await authController.hashPassword(password);

  const user = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  };

  try {
    const insertOneResult = await UserController.insertOne(user);
    res.statusMessage = "User created";
    res.sendStatus(201).end();
  } catch (error) {
    res.json({ message: error });  
  }

});

router.post("/login", async (req: Request, res: Response) => {

  let user: UserWithId;

  try {
    user = await UserController.findOneByUsername(req.body.username);
  } catch (err) {
    console.log(err);
    res.statusMessage = "User not found";
    res.sendStatus(404).end();
    return;
  }

  if (user === null) {
    res.statusMessage = "User not found";
    res.sendStatus(404).end();
    return;
  }

  //if user does not exist, send a 400 response
  if (await authController.comparePasswords(req.body.password, user.password)) {
    const username: string = req.body.username;
    const accessToken = await authController.generateAccessToken(username);
    const refreshToken = await authController.generateRefreshToken(username);
    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      userId: user._id.toString(),
      avatarUrl: user.avatarUrl
    });
  } else {
    res.statusMessage = "Password incorrect";
    res.sendStatus(401).end();
  }
});

//REFRESH TOKEN API
router.post("/refreshToken", async (req: Request, res: Response) => {
  const requestToken: string = req.body.token;
  if (!authController.refreshTokenExists(requestToken)) {
    res.status(400).send("Refresh Token Invalid");
  }
  const oldRefreshToken: string = req.body.token;
  authController.removeRefreshToken(oldRefreshToken);
  //remove the old refreshToken from the refreshTokens list
  const username: string = req.body.username;
  const accessToken = await authController.generateAccessToken(username);
  const newRefreshToken = await authController.generateRefreshToken(username);
  //generate new accessToken and refreshTokens
  res.json({
    accessToken: accessToken,
    refreshToken: newRefreshToken,
  });
});

router.delete("/logout", (req: Request, res: Response) => {
  const refreshToken: string = req.body.refreshToken;
  authController.removeRefreshToken(refreshToken);
  //remove the old refreshToken from the refreshTokens list
  res.statusMessage = "Logged out";
  res.status(204).end();
});

export default router;