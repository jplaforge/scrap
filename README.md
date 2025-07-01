# Scrap API

This repository contains a minimal serverless function deployed on Vercel.

### Usage

Send a `POST` request to `/api/analyze` with a JSON body:

```json
{ "url": "https://example.com" }
```

The endpoint launches a headless Chromium instance, captures a screenshot of the
page, runs OCR using `tesseract.js`, and extracts basic real estate data such as
bedrooms, bathrooms, area and price.

Visiting the root of the deployment serves `index.html` with instructions.
