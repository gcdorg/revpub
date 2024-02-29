import * as z from 'zod';

export interface ImageUploadParams {
  fileType: string,
  fileName: string,
  signedUrl: string
}

export const DeleteImageParams = z.object({
  fileName: z.string().min(1)
});
export type DeleteImageParams = z.infer<typeof DeleteImageParams>;

export const DeleteImageResponse = z.object({
  status: z.number()
});
export type DeleteImageResponse = z.infer<typeof DeleteImageResponse>;

export const SignedURLRequestData = z.object({
  bucketName: z.string().min(1),
  fileType: z.string().min(1)
});
export type SignedURLRequestData = z.infer<typeof SignedURLRequestData>;

export const SignedURLResponseData = z.object({
  category: z.string().min(1),
  message: z.string().min(1),
  signedUrl: z.string().min(1).optional(),
  fileName: z.string().min(1).optional()
});
export type SignedURLResponseData = z.infer<typeof SignedURLResponseData>;

export const ImageURL = z.object({
  url: z.string().min(1)
});
export type ImageURL = z.infer<typeof ImageURL>;