import axios from "axios";
import { SignedURLRequestData, SignedURLResponseData, ImageUploadParams } from '@revpub/types';

const defaultJsonOptions = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
};

export const getAvatarPutURL = (
  userId: string,
  signedUrlParams: SignedURLRequestData,
  onSuccess: (data: SignedURLResponseData) => void,
  onFailure: () => void
) => {
  if (userId === null) {
    return;
  }
  axios.post(`http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/api/v1/users/${userId}/getAvatarPutURL`,
    signedUrlParams,
    defaultJsonOptions
  )
  .then((response) => {
    if (response.status === 200) {
      onSuccess({
        category: 'success',
        message: 'success',
        signedUrl: response.data.signedUrl,
        fileName: response.data.fileName
      });
    } else {
      onFailure();
    }
  })
  .catch((error) => console.log(error));
    
};

export const uploadImage = (
  params: ImageUploadParams,
  imageBlob: Blob,
  onProgress: (event: any) => void,
  onSuccess: () => void,
  onFailure: () => void
) => {

  const url = params.signedUrl;

  const uploadJsonOptions = {
    headers: {
      "Content-Type": params.fileType,
      "x-amz-acl": "public-read",
    },
    onProgress
  };

  axios
    .put(url, imageBlob, uploadJsonOptions)
    .then((response) => {
      if (response.status === 200) {
        onSuccess();
      }
      else {
        onFailure();
      }
    })
    .catch((error) => console.log(error));

}

export const resizeImage = (file:File, maxWidth:number, maxHeight:number):Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
          let width = image.width;
          let height = image.height;
          
          if (width <= maxWidth && height <= maxHeight) {
              resolve(file);
          }

          let newWidth;
          let newHeight;

          if (width > height) {
              newHeight = height * (maxWidth / width);
              newWidth = maxWidth;
          } else {
              newWidth = width * (maxHeight / height);
              newHeight = maxHeight;
          }

          let canvas = document.createElement('canvas');
          canvas.width = newWidth;
          canvas.height = newHeight;

          let context = canvas.getContext('2d');

          if (context !== null) {
            context.drawImage(image, 0, 0, newWidth, newHeight);
          }

          canvas.toBlob(resolve as unknown as BlobCallback, file.type);
      };
      image.onerror = reject;
  });
}

export const getFullImagePath = (fileName: string): string => {
  return "https://" + import.meta.env.VITE_BUCKET_NAME + "." +
  import.meta.env.VITE_BUCKET_REGION + "." +
  import.meta.env.VITE_BUCKET_DOMAIN + "/" +
    fileName;
}