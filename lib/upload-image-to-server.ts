export async function uploadImageToServer (uri: string) {

  let apiUrl = 'https://tbga-screenshot.herokuapp.com/api/upload-image';

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  (formData as any).append('photo', {
    uri,
    name: `photo.${ fileType }`,
    type: `image/${ fileType }`,
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await fetch(apiUrl, options);
  const { imageUrl }: { imageUrl: string } = await response.json();
  return imageUrl;

}