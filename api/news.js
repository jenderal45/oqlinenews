export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed"
    });
  }

  // API Key dari Environment Variable
  const API_KEY = process.env.NEWSDATA_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({
      status: "error",
      message: "NEWSDATA_API_KEY belum diset di Vercel."
    });
  }

  const {
    q,
    category = "top",
    language = "id",
    country = "id",
    page = ""
  } = req.query;

  const url = new URL("https://newsdata.io/api/1/latest");

  url.searchParams.set("apikey", API_KEY);

  if (q) url.searchParams.set("q", q);
  if (category) url.searchParams.set("category", category);
  if (language) url.searchParams.set("language", language);
  if (country) url.searchParams.set("country", country);
  if (page) url.searchParams.set("page", page);

  try {
    const response = await fetch(url);

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (err) {

    return res.status(500).json({
      status: "error",
      message: err.message
    });

  }
}
