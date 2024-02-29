import { Response, Request, NextFunction } from 'express';
import {
  SignedURLParams,
  SignedURLResponseData,
  DeleteImageParams,
  DeleteImageResponse
} from "@revpub/types";
import { S3Controller } from "./image.controller";

export async function getPutUrl(req: Request<any, SignedURLResponseData, SignedURLParams>, res: Response<SignedURLResponseData>, next: NextFunction) {
  try {
    const getPutUrlResult = await S3Controller.getPutUrl(req.body);
    res.status(201);
    res.json(getPutUrlResult);
  } catch (error) {
    next(error);    
  }
}

export async function deleteImage(req: Request<{}, DeleteImageResponse, DeleteImageParams>, res: Response, next: NextFunction) {
  try {
    const deleteImageResult = await S3Controller.deleteObject(req.body.fileName);
    res.status(204)
    res.json(deleteImageResult);
  } catch (error) {
    next(error);
  }
}

// export async updateAvatarUrlByUserId(request: Request, response: Response, next: NextFunction) {
//   const id = parseInt(request.params.id);
//   const { avatarUrl } = request.body;
//   const user = await this.userRepository.findOneBy({
//       id: id,
//   });
//   user.avatarUrl = avatarUrl;
//   return this.userRepository.save(user);
// }

// export async removeAvatarUrlByUserId(userId: number) {
//   const user = await this.userRepository.findOneBy({
//       id: userId,
//   });
//   user.avatarUrl = null;
//   return this.userRepository.save(user);
// }