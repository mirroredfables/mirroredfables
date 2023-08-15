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
  //   await KV.put(
  //     "xyz",
  //     JSON.stringify({
  //       status: "active",
  //       openaiKey: "abc",
  //       elevenKey: "xyz",
  //     })
  //   );

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

  const OPENAI_API_KEY = proxyValue.openaiKey;

  // TODO: should set the model in request body to "gpt-3.5-turbo-16k" when using proxy

  const newRequest = new Request(
    `https://api.openai.com/v1/chat/completions`,
    new Request(context.request)
  );

  newRequest.headers.set("Authorization", `Bearer ${OPENAI_API_KEY}`);

  try {
    return await fetch(newRequest);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
};
