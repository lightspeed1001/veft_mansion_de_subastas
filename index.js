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

app.get('/api/arts/:id', async function(req, res) {
    const id = req.params.id;
    const result = await artService.getArtById(id);
    return res.json(result);
});

app.post('/api/arts', function(req, res) {
    artService.createArt(req.body, function(art) {
      return res.status(201).json(art);
    }, function(err) {
      return res.status(400).json(err);
    });
  });

// http://localhost:3000
app.listen(3000, function() {
    console.log('Server is listening on port 3000');
  });