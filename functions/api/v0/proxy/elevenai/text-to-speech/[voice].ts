interface Env {
  KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const KV = context.env.KV_PROXY;

  const proxyKey = context.request.headers.get("x-proxy-key");

  if (!proxyKey) {
    return new Response(JSON.stringify({ error: "x-proxy-key missing" }), {
      status: 400,
    });
  }

  //   // for local testing
  // await KV.put(
  //   "xyz",
  //   JSON.stringify({
  //     status: "active",
  //     openaiKey: "abc",
  //     elevenKey: "xyz",
  //   })
  // );

  const proxyValue = await KV.get(proxyKey, { type: "json" });

  if (!proxyValue) {
    return new Response(JSON.stringify({ error: "x-proxy-key not valid" }), {
      status: 400,
    });
  }

  const PROXY_KEY_STATUS = proxyValue.status;

  if (PROXY_KEY_STATUS != "active") {
    return new Response(JSON.stringify({ error: "x-proxy-key not active" }), {
      status: 500,
    });
  }

  const ELEVENAI_API_KEY = proxyValue.elevenKey;

  const voice = context.params.voice;

  const newRequest = new Request(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
    new Request(context.request)
  );

  newRequest.headers.set("xi-api-key", ELEVENAI_API_KEY);

  try {
    return await fetch(newRequest);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
};
