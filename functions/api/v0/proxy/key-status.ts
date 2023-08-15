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

  // for local testing
  //   await KV.put(
  //     "xyz",
  //     JSON.stringify({
  //       status: "active",
  //     })
  //   );
  //   await KV.put(
  //     "abc",
  //     JSON.stringify({
  //       status: "expired",
  //     })
  //   );

  const proxyValue = await KV.get(proxyKey, { type: "json" });

  if (!proxyValue) {
    return new Response(
      JSON.stringify({ result: "error: x-proxy-key not valid" }),
      {
        status: 400,
      }
    );
  }

  const PROXY_KEY_STATUS = proxyValue.status;

  if (PROXY_KEY_STATUS == "active") {
    return new Response(
      JSON.stringify({ result: "success: x-proxy-key active" }),
      {
        status: 200,
      }
    );
  }

  return new Response(
    JSON.stringify({ result: "error: x-proxy-key not active" }),
    {
      status: 500,
    }
  );
};
