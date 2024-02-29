import { NextFunction, Request, Response } from "express"
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

class AuthController {

  // refreshTokens
  private refreshTokens: string[] = [];

  // generateAccessToken
  async generateAccessToken(user: string) {
    const accessToken: string = jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: 60 * 15
    });
    return accessToken;
  }

  // generateRefreshToken
  async generateRefreshToken(user: string) {
    const refreshToken: string = jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET as string, {
      expiresIn: 60 * 20
    });
    this.refreshTokens.push(refreshToken);
    return refreshToken;
  }

  // comparePasswords
  async comparePasswords(requestPassword: string, userPassword: string) {
    let result: boolean = await bcrypt.compare(requestPassword, userPassword)
    return result;
  }

  // refreshTokenExists
  refreshTokenExists(token: string) {
    let result: boolean = this.refreshTokens.includes(token);
    return result;
  }

  // hashPassword
  async hashPassword(password: string) {
    const result: string = await bcrypt.hash(password, 10);
    return result;
  }

  removeRefreshToken(token: string) {
    this.refreshTokens = this.refreshTokens.filter((c) => c != token);
  }

  async validateToken(req: Request, res: Response, next: NextFunction) {
    //get token from request header
    const authHeader = req.headers["authorization"];
    if (authHeader === undefined) {
      res.statusMessage = "Authorization token not present";
      res.sendStatus(400).end();
      return;
    }

    const token = authHeader.split(" ")[1];
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) {
      res.statusMessage = "Authorization token not present";
      res.sendStatus(400).end();
      return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
      if (err) {
        res.statusMessage = "Authorization token invalid";
        res.status(403).end();
      } else {
        req.body.user = user;
        next(); //proceed to the next action in the calling function
      }
    }); //end of jwt.verify()
  } //end of function

}

let authController = new AuthController();

export default authController;