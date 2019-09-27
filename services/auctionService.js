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
        errorCb(500, err);
      } else if (auction === null) {
        errorCb(404, 'Auction not fount');
      } else {
        cb(auction);
      }
    });
  };

  const getAuctionWinner = (auctionId, cb, errorCb) => {
    Auction.findById(auctionId, function(err, auction) {
      if (err) {
        errorCb(500, err);
      } else if (auction === null) {
        errorCb(404, 'Auction not found');
      } else if (new Date(auction.endDate) > new Date()) {
        errorCb(409, err);
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

  const createAuction = (auction, cb, errorCb) => {
    Art.findById(auction.artId, function(err, art) {
      if (err) {
        errorCb(500, 'Iternal database error');
      } else if (art === null) {
        errorCb(400, 'Art not found');
      } else if (!art.isAuctionItem) {
        errorCb(412, 'Selected art is not an auction item');
      } else {
        Auction.find({ artId: auction.artId }, function(err, auction) {
          if (err) {
            errorCb(500, 'Iternal database error');
          }
          if (auction === null || new Dare(auction.endDate) < new Date()) {
            Auction.create(auction, function(err, auction) {
              if (err) {
                errorCb(500, 'Iternal database error');
              } else {
                cb();
              }
            });
          } else {
            errorCb(
              409,
              'There already is a current auction with the same art'
            );
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
        auction.save(function cb(err) {
          if (err) errorCb(500, 'Internal database error');
          else cb(bid);
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

      if (maxBid >= price) errorCb(412, null);
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
      if (customer === null) errorCb(400, err);
      else if (err) errorCb(400, err);
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
      if (err) errorCb(404, err);
      else if (auction === null) errorCb(404, err);
      else if (auction.minimumPrice > price) errorCb(412, err);
      else if (new Date(auction.endDate) < new Date()) errorCb(403, err);
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
        Auction.findById(auctionId, (error, auction) => {
            if (error) err(error);
            else if (auction === null) err(getNotFoundError('Auction', '_id', auctionId));
            else if (auction.endDate <
                new Date()) err(getCustomError(403, 'Auction has finished'));
            else if (auction.minimumPrice >
                price) err(getCustomError(412, 'Bid has to be higher or equal to minimum asking price'));
            else placeBidWithAuctionWrapper(auctionId, customerId, price, cb, errorCb);
        });
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
