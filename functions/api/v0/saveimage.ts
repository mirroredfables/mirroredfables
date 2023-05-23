interface Env {
  KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const CLOUDFLARE_ACCOUNT_ID = context.env.CLOUDFLARE_ACCOUNT_ID;
  const CLOUDFLARE_API_TOKEN = context.env.CLOUDFLARE_API_TOKEN;

  const request = await context.request.json();
  const imageUrl = request.image;
  const metadata = { app: "mirroredfables", version: "1" };
  const requireSignedURLs = false;

  const formData = new FormData();
  formData.append("url", imageUrl);
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
