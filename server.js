const express = require('express');
const scrapeCookies = require('./scrape');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing ?url=' });

  try {
    const { cookies, finalUrl } = await scrapeCookies(url);
    res.json({ success: true, finalUrl, cookieCount: cookies.length, cookies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Playwright API is up. Use /scrape?url=...');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
