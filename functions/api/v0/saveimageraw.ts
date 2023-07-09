// example request body
// {
//  "image": "...some base64 string"
//}
import * as stream from "stream";

// Utility function that transforms base64 to Blob
function decodeBase64(base64Data) {
  const text = atob(base64Data);
  const data = new Uint8Array(text.length);

  for (let i = 0; i < text.length; ++i) {
    data[i] = text.charCodeAt(i);
  }

  const blob = new Blob([data], { type: "image/png" });

  return blob;
}

interface Env {
  KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const CLOUDFLARE_ACCOUNT_ID = context.env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = context.env.CLOUDFLARE_API_TOKEN;

  const request = await context.request.json();
  const imageBase64 = request.image;

  // Convert base64 image to Blob
  const imageBlob = decodeBase64(imageBase64);

  const metadata = { app: "mirroredfables", version: "1" };
  const requireSignedURLs = false;

  const formData = new FormData();
  formData.append("file", imageBlob, "image.png"); // set filename to your actual file name
  formData.append("metadata", JSON.stringify(metadata));
  formData.append("requireSignedURLs", requireSignedURLs.toString());

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    }
  );

  //   const jsonResponse = await response.json();
  //   console.log(jsonResponse);
  return response;
};
