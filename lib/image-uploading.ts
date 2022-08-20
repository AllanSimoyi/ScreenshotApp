const CLOUD_NAME = "dv2mivpiz";
const UPLOAD_RESET = 'pbpinhve';

export type UploadState = 'uploading' | 'uploaded' | 'error' | 'idle';

export async function handleImageUpload (blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', UPLOAD_RESET);
    formData.append('tags', 'rte');
    formData.append('context', '');
    const url = `https://api.cloudinary.com/v1_1/${ CLOUD_NAME }/upload`;
    fetch(url, { method: 'POST', body: formData })
      .then((response) => response.json())
      .then((result) => resolve(result.url as string))
      .catch((error) => reject(new Error('Upload failed')));
  });
}
