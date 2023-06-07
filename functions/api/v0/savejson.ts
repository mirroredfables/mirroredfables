interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    // Check if the request body is valid JSON
    const requestBody = await context.request.json();

    const generatedUuid = crypto.randomUUID();
    const filePath = `json/${generatedUuid}.json`;

    await context.env.BUCKET.put(filePath, JSON.stringify(requestBody));

    const jsonResponse = {
      uuid: generatedUuid,
      path: filePath,
      status: "success",
    };

    return new Response(JSON.stringify(jsonResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response("Invalid JSON in request body", {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
};
