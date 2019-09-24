const Auction = require('../data/db').Auction;
const Customer = require('../data/db').Customer;
const Art = require('../data/db').Art;

const auctionService = () => {
  const getAllAuctions = (cb, errorCb) => {
    Auction.find({}, function(err, auctions) {
      if (err) {
        errorCb(err);
      } else {
        cb(auctions);
      }
    });
  };

  const getAuctionById = (id, cb, errorCb) => {
    Auction.findById(id, function(err, auction) {
      if (err) {
        throw new Error(err);
      } else if (auction === null) {
        errorCb();
      } else {
        cb(auction);
      }
    });
  };

  const getAuctionWinner = (auctionId, cb, errorCb) => {
    Auction.findById(auctionId, function(err, auction) {
      if (err) {
          console.log('error in find auction');
        throw new Error(err);
      } else if (auction === null) {
          console.log('no auction found');
        errorCb(404);
      } else if (new Date(auction.endDate) > new Date()) {
          console.log('auction has not ended yet');
        errorCb(409);
      } else {
        console.log('found auction: ', auction);
        Customer.findById(auction.auctionWinner, function(err, customer) {
          if (err) {
              console.log('error in find customer');
            throw new Error(err);
          } else if (customer === null) {
              console.log('customer not found');
              errorCb(404);
          } else {
              console.log('customer found: ', customer);
              cb(customer);
          }
        });
      }
    });
  };

  const createAuction = (auction, cb, errorCb) => {
    Art.findById(auction.artId, function(err, art) {
        if (err) {
            errorCb(500);
        } else if(art === null) {
            errorCb(400);
        } else if(!art.isAuctionItem) {
            errorCb(412);
        } else {
            Auction.create(auction, function(err, auction) {
                if (err) {
                    errorCb(500);
                } else {
                    cb(auction);
                }
            });
        }
    });
  };

  const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
    // Your implementation goes here
  };

  const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
    // Your implementation goes here
  };

  return {
    getAllAuctions,
    getAuctionById,
    getAuctionWinner,
    createAuction,
    getAuctionBidsWithinAuction,
    placeNewBid
  };
};

module.exports = auctionService();
