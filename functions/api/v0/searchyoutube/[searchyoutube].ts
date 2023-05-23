interface Env {
  KV: KVNamespace;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const YOUTUBE_API_KEY = context.env.YOUTUBE_API_KEY;

  const rawQuery = context.params.searchyoutube;

  const query = [...rawQuery].join(" ");

  if (!query) {
    return new Response("Query parameter missing", { status: 400 });
  }

  async function searchVideo(query: string): Promise<string> {
    const apiUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    apiUrl.searchParams.set("part", "id,snippet");
    apiUrl.searchParams.set("type", "video");
    apiUrl.searchParams.set("q", query);
    // apiUrl.searchParams.set("videoDefinition", "high");
    apiUrl.searchParams.set("videoEmbeddable", "true");
    apiUrl.searchParams.set("maxResults", "1");
    apiUrl.searchParams.set("fields", "items(id(videoId),snippet(title))");
    apiUrl.searchParams.set("key", YOUTUBE_API_KEY);

    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    if (data.items.length > 0) {
      const video_id = data.items[0].id.videoId;
      // const title = data.items[0].snippet.title;
      // console.log(
      //   `Title: ${title}\nURL: https://www.youtube.com/watch?v=${video_id}`
      // );
      return video_id;
    } else {
      // console.log("No video found.");
      return "";
    }
  }

  const video_id = await searchVideo(query);

  return new Response(JSON.stringify({ video_id: video_id }), {
    status: 200,
  });
};
