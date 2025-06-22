# Playwright Scraper for Render

Scrape cookies from a page using Playwright and expose them via Express API.

## Endpoints

- `/scrape?url=https://example.com/stream-123.php`  
Returns cookies and final redirected URL.

## Deployment (Render)

1. Push this repo to GitHub
2. Go to [Render.com](https://dashboard.render.com/)
3. Create a **New Web Service**
4. Connect this repo
5. Set `Build Command`: `npm install`
6. Set `Start Command`: `npm start`
7. Done!

