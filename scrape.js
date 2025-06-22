const { chromium } = require('playwright');

async function extractChannelId(url) {
  const match = url.match(/(?:stream-|id=)(\d+)/);
  return match ? match[1] : null;
}

async function scrapeCookies(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.route('**/*.{png,jpg,jpeg,svg,gif,webp,woff,woff2,css,mp4,webm}', route => route.abort());
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(5000);

  const finalUrl = page.url();

  // 🔍 Cari tag <video> atau player script yang mengandung m3u8
  const videoUrl = await page.evaluate(() => {
    // Langkah 1: Cek video tag
    const video = document.querySelector('video');
    if (video && video.src) return video.src;

    // Langkah 2: Cek global player object
    if (window.jwplayer) {
      try {
        const playlist = jwplayer().getPlaylist();
        return playlist?.[0]?.file || null;
      } catch (e) {}
    }

    // Langkah 3: Cari dari semua script
    const scripts = Array.from(document.scripts);
    for (const script of scripts) {
      if (script.textContent.includes('.m3u8')) {
        const match = script.textContent.match(/https?:\/\/[^"']+\.m3u8/);
        if (match) return match[0];
      }
    }

    return null;
  });

  const cookies = await context.cookies();
  await browser.close();

  return { cookies, finalUrl, videoUrl };
}

module.exports = scrapeCookies;
