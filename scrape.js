const { chromium } = require('playwright');

async function extractChannelId(url) {
  const match = url.match(/(?:stream-|id=)(\d+)/);
  return match ? match[1] : null;
}

async function scrapeCookies(channelUrl) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();
  await page.route('**/*.{png,jpg,jpeg,svg,gif,webp,woff,woff2,css,mp4,webm}', route => route.abort());
  await page.goto(channelUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(5000);

  const finalUrl = page.url();
  const channelId = await extractChannelId(channelUrl);
  if (channelId && !finalUrl.includes(channelId)) {
    console.warn(`Redirected URL doesn't contain expected channel ID: ${channelId}`);
  }

  const cookies = await context.cookies();
  await browser.close();

  return { cookies, finalUrl };
}

module.exports = scrapeCookies;
