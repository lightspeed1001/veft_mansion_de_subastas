// Here the web service should be setup and routes declared
const artService = require('./services/artService');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// http://localhost:3000/api/arts [GET]
app.get('/api/arts', async function(req, res) {
    const result = await artService.getAllArts();
    return res.json(result);
});

// http://localhost:3000
app.listen(3000, function() {
    console.log('Server is listening on port 3000');
  });