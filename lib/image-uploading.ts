const CLOUD_NAME = "dv2mivpiz";
const UPLOAD_RESET = 'pbpinhve';

export type UploadState = 'uploading' | 'uploaded' | 'error' | 'idle';

// const CLOUDINARY_API_KEY = "993114726362865";
// const CLOUDINARY_API_SECRET = "Rp2KAu3wG3ydmJrQQmxp-iZM-LY";

// export async function handleImageUpload(file: File) {
export async function handleImageUpload (blob: Blob) {
  return new Promise<string>((resolve, reject) => {

    const formData = new FormData();
    // formData.append('file', file);
    formData.append('file', blob);
    formData.append('upload_preset', UPLOAD_RESET);
    formData.append('tags', 'rte');
    formData.append('context', '');

    const url = `https://api.cloudinary.com/v1_1/${ CLOUD_NAME }/upload`;

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return resolve(result.url as string);
      })
      .catch((error) => {
        console.log(error as any);
        reject(new Error('Upload failed'));
      });
      // .catch(({ message }) => {
      //   console.log('Something went wrong');
      //   console.log(message as string);
      //   reject(new Error('Upload failed'));
      // });
  });
}
