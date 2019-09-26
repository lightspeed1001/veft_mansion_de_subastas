// Here the web service should be setup and routes declared
const artService = require('./services/artService');
const artistService = require('./services/artistService');
const auctionService = require('./services/auctionService');
const customerService = require('./services/customerService');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Arts
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
  artService.createArt(
    req.body,
    function(art) {
      return res.status(201).json(art);
    },
    function(status, err) {
      return res.status(status).json(err);
    }
  );
});

// Artists
// http://localhost:3000/api/artist [GET]
app.get('/api/artists', async function(req, res) {
  const result = await artistService.getAllArtists();
  return res.json(result);
});

app.get('/api/artists/:id', async function(req, res) {
  const id = req.params.id;
  const result = await artistService.getArtistById(id);
  return res.json(result);
});

app.post('/api/artists', function(req, res) {
  artistService.createArtist(
    req.body,
    function(art) {
      return res.status(201).json(art);
    },
    function(status, err) {
      return res.status(status).json(err);
    }
  );
});

// Customers
// http://localhost:3000/api/customers [GET]
app.get('/api/customers', async function(req, res) {
  customerService.getAllCustomers(function(customers) {
    return res.status(200).json(customers);
  }, function(status, err) {
    // Weird database error
    return res.status(status).json(err);
  });
});

// http://localhost:3000/api/customers/id [GET]
app.get('/api/customers/:id', async function(req, res) {
  const id = req.params.id;
  customerService.getCustomerById(id, function(customer) {
    return res.status(200).json(customer);
  }, function(status, err) {
    // Customer not found
    return res.status(status).json(err);
  });
});

// http://localhost:3000/api/customers [POST]
app.post('/api/customers', function(req, res) {
  customerService.createCustomer(
    req.body,
    function(cust) {
      return res.status(201).json(cust);
    },
    function(status, err) {
      return res.status(status).json(err);
    }
  );
});

// http://localhost:3000/api/customers/:id/auction-bids [GET]
app.get('/api/customers/:id/auction-bids', async function(req, res) {
  const id = req.params.id;
  customerService.getCustomerAuctionBids(id, function(auctions) {
      return res.status(200).json(auctions);
  }, function(status, err){
    return res.status(status).json(err);
  });
});

// Auctions
// http://localhost:3000/api/auctions [GET]
app.get('/api/auctions', async function(req, res) {
  auctionService.getAllAuctions(function(auctions) {
    return res.status(200).json(auctions);
  }, function(status, err) {
    return res.status(status).json(err);
  });
});

app.get('/api/auctions/:id', async function(req, res) {
  const id = req.params.id;
    auctionService.getAuctionById(id, function(auction) {
      return res.status(200).json(auction);
    }, function(status, err) {
      return res.status(status).json(err);
    });
});

// http://localhost:3000/api/customers/:id/auction-bids [GET]
app.get('/api/auctions/:id/winner', async function(req, res) {
  const id = req.params.id;
    console.log("route started");
    auctionService.getAuctionWinner(id, function( winner ) {
      return res.status(200).json(winner);
    }, function(status, err) {
      console.log('error');
      return res.status(status).json(err);
    })
});

// http://localhost:3000/api/customers/:id/auction-bids [GET]
app.get('/api/auctions/:id/bids', async function(req, res) {
  const id = req.params.id;
    auctionService.getAuctionBidsWithinAuction(id, function(bids) {
      return res.status(200).json(bids);
    }, function(status, err) {
      return res.status(status).json(err);
    })
});

app.post('/api/auctions/:id/bids', function(req, res) {
  const auctionId = req.params.id;
  const customerId = req.body.customerId;
  const price = req.body.price;
  auctionService.placeNewBid(
    auctionId, customerId, price,
    function(auction) {
      return res.status(201).json(auction);
    },
    function(status, err) {
      return res.status(status).json(err);
    }
  );
});

app.post('/api/auctions', function(req, res) {
  auctionService.createAuction(
    req.body,
    function(auction) {
      return res.status(201).json(auction);
    },
    function(status, err) {
      return res.status(status).json(err);
    }
  );
});

// http://localhost:3000
app.listen(3000, function() {
  console.log('Server is listening on port 3000');
});
