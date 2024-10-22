import { fetchFromTMDB } from '../../lib/tmdbClient';

export default async function handler(req, res) {
  if (!req.query) {
    return res.status(400).json({ error: 'Query object is missing' });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const data = await fetchFromTMDB(`/search/multi?query=${encodeURIComponent(query)}`);

    if (data && data.results) {
      const suggestions = data.results.map(item => item.title || item.name);
      return res.status(200).json(suggestions);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
