import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from 'uuid';
import { SignedURLRequestData, SignedURLResponseData } from '@revpub/types';

export class S3Controller {

  static accessKeyId = process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY || '';
  static secretAccessKey = process.env.LINODE_OBJECT_STORAGE_SECRET_KEY || '';

  public static getPutUrl = async (signedUrlParams: SignedURLRequestData): Promise<SignedURLResponseData> => {

    let extension = "";
    switch (signedUrlParams.fileType) {
      case "image/jpeg":
        extension = ".jpg";
        break;
      case "image/png":
        extension = ".png";
        break;
      default:
        return {
          category: "error",
          message: "Unallowable file type"
        };
    }
    const fileName = uuid() + extension;

    const s3Client = new S3Client({
      endpoint: 'https://us-east-1.linodeobjects.com',
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      }
    });

    let signedUrlResponseData: SignedURLResponseData = {
      category: 'error',
      message: 'Unknown error occurred'
    };

    try {
      const putObjectCommand = new PutObjectCommand({
        Bucket: signedUrlParams.bucketName,
        Key: fileName,
        ACL: "public-read", // This allows anyone to access the uploaded image
      });

      const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 60, // Expires in 1 minutes
      });

      signedUrlResponseData = {
        category: "success",
        message: "Put URL successfully obtained",
        signedUrl: signedUrl,
        fileName: fileName
      };

    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return {
          category: 'error',
          message: error.message
        };
      }
    }

    return signedUrlResponseData;

  }

  public static deleteObject = (fileName: string) => {

    return new Promise(async (resolve, reject) => {

      if (fileName === undefined || fileName === null || fileName === "") {
        reject(new Error("fileName empty"));
      }

      const s3Client = new S3Client({
        endpoint: 'https://us-east-1.linodeobjects.com',
        region: 'us-east-1',
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });

      const bucketName = process.env.BUCKET_NAME;

      const deleteObjectCommand = new DeleteObjectCommand({ 
        Bucket: bucketName,
        Key: fileName
      });

      const result = await s3Client.send(deleteObjectCommand);

      resolve("Object deleted");
    });

  }

}
