import { createApp } from './app.js';

// Entry point: build the app and start listening. Railway injects PORT.
const app = createApp();
const port = process.env.PORT || 4100;

app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
});
