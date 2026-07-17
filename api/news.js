// API Proxy - API Key disembunyikan di server
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // API Key disimpan di environment variable (aman!)
  const API_KEY = process.env.NEWS_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'API Key not configured',
      message: 'Tambahkan NEWS_API_KEY di Vercel Environment Variables'
    });
  }

  // Ambil parameter dari query
  const { category = 'general', query, lang = 'id' } = req.query;
  
  let url;
  if (query) {
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=${lang}&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?category=${category}&language=${lang}&pageSize=20&apiKey=${API_KEY}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ok') {
      return res.status(200).json(data);
    } else {
      return res.status(400).json({ 
        error: data.message || 'Failed to fetch news',
        status: 'error'
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      status: 'error'
    });
  }
}