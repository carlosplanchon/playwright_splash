const express = require('express');
const { chromium } = require('playwright-extra');
const { PlaywrightBlocker } = require('@cliqz/adblocker-playwright');
const randomAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
const { fetch } = require('cross-fetch');
const stealth = require('puppeteer-extra-plugin-stealth')();

const app = express();
const port = 56572;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let browser;

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function launchBrowser(url) {
  const context = await browser.newContext({ userAgent: randomAgent });
  const page = await context.newPage();

  PlaywrightBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
    blocker.enableBlockingInPage(page);
  });

  await page.setDefaultNavigationTimeout(0);

  await page.goto(url, {
    timeout: 60000,
    waitUntil: 'load',
    referer: 'https://www.google.com/'
  });

  await page.setViewportSize({ width: 1600, height: 10000 });
  await autoScroll(page);

  return page.content();
};

app.post('/scrape', async (req, res) => {
  if (!browser) {
    console.log("-> Launching Chromium.")
    chromium.use(stealth);
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  try {
    console.log("-> URL:", req.body.url)
    const content = await launchBrowser(req.body.url);
    console.log("· Sending response.")
    res.send(content);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://localhost:${port}`);
});
