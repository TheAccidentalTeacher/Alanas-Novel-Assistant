// Image Search API for Alana's Writing Workspace
// Provides access to Pexels, Pixabay, and OpenClipart for character inspiration and book covers

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, source = 'pexels', per_page = 6 } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    let images = [];

    switch (source) {
      case 'pexels':
        images = await searchPexels(query, per_page);
        break;
      case 'pixabay':
        images = await searchPixabay(query, per_page);
        break;
      case 'openclipart':
        images = await searchOpenClipart(query, per_page);
        break;
      default:
        return res.status(400).json({ error: 'Invalid source' });
    }

    return res.status(200).json({
      success: true,
      source,
      query,
      images
    });

  } catch (error) {
    console.error('Image Search Error:', error);
    return res.status(500).json({
      error: 'Image search temporarily unavailable',
      fallback: 'Try searching manually on the respective platforms'
    });
  }
}

async function searchPexels(query, per_page) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${per_page}`,
    {
      headers: {
        'Authorization': process.env.PEXELS_API_KEY
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.photos?.map(photo => ({
    id: photo.id,
    url: photo.src.medium,
    thumbnail: photo.src.small,
    alt: photo.alt,
    photographer: photo.photographer,
    source: 'Pexels'
  })) || [];
}

async function searchPixabay(query, per_page) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${per_page}&safesearch=true`
  );

  if (!response.ok) {
    throw new Error(`Pixabay API error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.hits?.map(hit => ({
    id: hit.id,
    url: hit.webformatURL,
    thumbnail: hit.previewURL,
    alt: hit.tags,
    photographer: hit.user,
    source: 'Pixabay'
  })) || [];
}

async function searchOpenClipart(query, per_page) {
  const response = await fetch(
    `https://openclipart.org/search/json/?query=${encodeURIComponent(query)}&amount=${per_page}`
  );

  if (!response.ok) {
    throw new Error(`OpenClipart error: ${response.status}`);
  }

  const data = await response.json();
  
  return data.payload?.map(item => ({
    id: item.id,
    url: item.svg.png_full_lossy,
    thumbnail: item.svg.png_thumb,
    alt: item.title,
    photographer: item.uploader.username,
    source: 'OpenClipart'
  })) || [];
}
