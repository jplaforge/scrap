const { default: chromium } = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');
const { createWorker } = require('tesseract.js');
const path = require('node:path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Only POST supported' });
    return;
  }

  const { url } = req.body || {};
  if (!url) {
    res.status(400).json({ error: 'Missing url' });
    return;
  }

  let browser;
  try {
    chromium.setGraphicsMode = false;
    const executablePath = await chromium.executablePath();
    browser = await puppeteer.launch({
      args: puppeteer.defaultArgs({ args: [...chromium.args, "--ignore-certificate-errors"], headless: "shell" }),
      executablePath,
      headless: "shell",
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const buffer = await page.screenshot({ fullPage: true });
    await browser.close();

    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();

    const bedrooms = (text.match(/(\d+)\s*(?:bed|bd|beds|bedrooms)/i) || [])[1] || null;
    const bathrooms = (text.match(/(\d+)\s*(?:bath|ba|baths|bathrooms)/i) || [])[1] || null;
    const area = (text.match(/([\d,]+)\s*(?:sq\.?\s*ft|square\s*feet|sqft)/i) || [])[1] || null;
    const price = (text.match(/\$[\d,]+/) || [])[0] || null;

    res.status(200).json({ text, bedrooms, bathrooms, area, price });
  } catch (err) {
    if (browser) await browser.close();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
