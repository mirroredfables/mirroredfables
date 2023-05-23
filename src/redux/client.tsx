// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

export async function client(
  endpoint: string,
  { body, method, ...customConfig } = {}
) {
  const headers = {
    // "Content-Type": "application/json",
  };

  const config = {
    method: method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let data;
  try {
    const response = await window.fetch(endpoint, config);
    data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(response.statusText);
  } catch (err) {
    return Promise.reject(err.message ? err.message : data);
  }
}

client.get = function (endpoint: string, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" });
};

client.post = function (endpoint: string, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "POST", body });
};

client.patch = function (endpoint: string, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "PATCH", body });
};

client.delete = function (endpoint: string, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "DELETE", body });
};
