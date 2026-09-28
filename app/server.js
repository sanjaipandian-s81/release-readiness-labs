const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Release Readiness Lab API');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', version: process.env.npm_package_version || '1.0.0' });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
