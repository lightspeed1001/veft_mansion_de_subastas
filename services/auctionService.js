const Auction = require('../data/db').Auction;
const Customer = require('../data/db').Customer;
const Art = require('../data/db').Art;
const Bids = require('../data/db').AuctionBid;

const auctionService = () => {
  const getAllAuctions = (cb, errorCb) => {
    Auction.find({}, function(err, auctions) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else {
        cb(auctions);
      }
    });
  };

  const getAuctionById = (id, cb, errorCb) => {
    Auction.findById(id, function(err, auction) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else if (auction === null) {
        errorCb(404, 'Auction not found');
      } else {
        cb(auction);
      }
    });
  };

  const getAuctionWinner = (auctionId, cb, errorCb) => {
    Auction.findById(auctionId, function(err, auction) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else if (auction === null) {
        errorCb(404, 'Auction not found');
      } else if (new Date(auction.endDate) > new Date()) {
        errorCb(409, 'Auction has not ended');
      } else {
        Customer.findById(auction.auctionWinner, function(err, customer) {
          if (err) {
            errorCb(500, err);
          } else if (customer === null) {
            cb('This auction had no bids.');
          } else {
            cb(customer);
          }
        });
      }
    });
  };

  const createAuction = (new_auction, cb, errorCb) => {
    Art.findById(new_auction.artId, function(err, art) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else if (art === null) {
        errorCb(400, 'Art not found');
      } else if (!art.isAuctionItem) {
        errorCb(412, 'Selected art is not an auction item');
      } else {
        Auction.findOne({ artId: new_auction.artId }, function(err, auction) {
          if (err) {
            errorCb(500, 'Internal database error');
          }
          else if (auction !== null){
            errorCb(409, 'This piece is already up for auction');
          }
          else {
            Auction.create(new_auction, function(err, created_auction) {
              if (err) {
                errorCb(500, 'Internal database error');
              } else {
                cb();
              }
            });
          }
        });
      }
    });
  };

  const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
    Bids.find({ auctionId: auctionId }, function(err, bids) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else {
        cb(bids);
      }
    });
  };

  function saveBidWrapper(auction, customerId, cb, errorCb) {
    return function(err, bid) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else {
        auction.auctionWinner = customerId;
        auction.save(function save_cb(err, doc, rows) {
          if (err) errorCb(500, 'Internal database error');
          else cb();
        });
      }
    };
  }

  function processBidsWrapper(
    auction,
    auctionId,
    customerId,
    price,
    cb,
    errorCb
  ) {
    return function processBids(bids) {
      maxBid = 0;
      bids.forEach(element => {
        if (element.price >= maxBid) maxBid = element.price;
      });

      if (maxBid >= price) errorCb(412, "Price not high enough");
      else {
        Bids.create(
          { auctionId: auctionId, customerId: customerId, price: price },
          saveBidWrapper(auction, customerId, cb, errorCb)
        );
      }
    };
  }

  function placeBidWithCustomerWrapper(
    auction,
    auctionId,
    customerId,
    price,
    cb,
    errorCb
  ) {
    return function placeBidWithCustomer(err, customer) {
      if (err) errorCb(400, "Internal database error");
      else if (customer === null) errorCb(400, "Customer not found");
      else {
        getAuctionBidsWithinAuction(
          auctionId,
          processBidsWrapper(
            auction,
            auctionId,
            customerId,
            price,
            cb,
            errorCb
          ),
          function(err) {
            errorCb(404, err);
          }
        );
      }
    };
  }

  function placeBidWithAuctionWrapper(
    auctionId,
    customerId,
    price,
    cb,
    errorCb
  ) {
    return function pladeBidWithAuction(err, auction) {
      if (err) errorCb(404, "Internal database error");
      else if (auction === null) errorCb(404, "Auction not found");
      else if (auction.minimumPrice > price) errorCb(412, "Price not high enough");
      else if (new Date(auction.endDate) < new Date()) errorCb(403, "Auction has already ended");
      else
        Customer.findById(
          customerId,
          placeBidWithCustomerWrapper(
            auction,
            auctionId,
            customerId,
            price,
            cb,
            errorCb
          )
        );
    };
  }

  const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
    // Make sure auctionId and customerId are valid
    Auction.findById(
      auctionId,
      placeBidWithAuctionWrapper(auctionId, customerId, price, cb, errorCb)
    );
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
