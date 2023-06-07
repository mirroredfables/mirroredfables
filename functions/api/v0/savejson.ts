interface Env {
  BUCKET: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const generatedUuid = crypto.randomUUID();

  await context.env.BUCKET.put(
    `game/${generatedUuid}.json`,
    context.request.body
  );
  return new Response(`Put ${generatedUuid} successfully!`);
};
