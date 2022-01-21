const path = require('path');
const express = require('express');

const app = express();

const staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

app.listen(3000, function() {
  console.log('Server listening on http://localhost:3000');
});
