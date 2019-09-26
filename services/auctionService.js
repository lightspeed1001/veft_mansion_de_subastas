const Auction = require('../data/db').Auction;
const Customer = require('../data/db').Customer;
const Art = require('../data/db').Art;
const Bids = require('../data/db').AuctionBid;

const auctionService = () => {
  const getAllAuctions = (cb, errorCb) => {
    Auction.find({}, function(err, auctions) {
      if (err) {
        errorCb(500, err);
      } else {
        cb(auctions);
      }
    });
  };

  const getAuctionById = (id, cb, errorCb) => {
    Auction.findById(id, function(err, auction) {
      if (err) {
        errorCb(500, err)
      } else if (auction === null) {
        errorCb(404, err);
      } else {
        cb(auction);
      }
    });
  };

  const getAuctionWinner = (auctionId, cb, errorCb) => {
    Auction.findById(auctionId, function(err, auction) {
      if (err) {
          console.log('error in find auction');
        errorCb(500, err)
      } else if (auction === null) {
          console.log('no auction found');
        errorCb(404, err);
      } else if (new Date(auction.endDate) > new Date()) {
          console.log('auction has not ended yet');
        errorCb(409, err);
      } else {
        console.log('found auction: ', auction);
        Customer.findById(auction.auctionWinner, function(err, customer) {
          if (err) {
              console.log('error in find customer');
              errorCb(500, err)
          } else if (customer === null) {
              console.log('customer not found');
              errorCb(404, err);
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
            errorCb(500, err);
        } else if(art === null) {
            errorCb(400, err);
        } else if(!art.isAuctionItem) {
            errorCb(412, err);
        } else {
            Auction.create(auction, function(err, auction) {
                if (err) {
                    errorCb(500, err);
                } else {
                  cb(auction);
                }
            });
        }
    });
  };

  const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
    Bids.find({auctionId: auctionId}, function(err, bids) {
      if(err) errorCb(404, err);
      else cb(bids)
    })
  };

  function saveBidWrapper(auction, customerId, cb, errorCb){
    return function(err, bid) {
      if(err) errorCb(500, err);
      else 
      {
        auction.auctionWinner = customerId;
        auction.save(function cb(err) {
          if(err) errorCb(500, err);
          else cb(bid);
        });
      }
    }
  }

  function processBidsWrapper(auction, auctionId, customerId, price, cb, errorCb) {
    return function processBids (bids) {
      maxBid = 0;
      bids.forEach(element => {
        if(element.price >= maxBid) maxBid = element.price;
      });
      
      if(maxBid >= price) errorCb(412, null);
      else {  
        Bids.create({auctionId: auctionId, customerId:customerId, price:price}, saveBidWrapper(auction, customerId, cb, errorCb));
      }
    }
  }

  function placeBidWithCustomerWrapper (auction, auctionId, customerId, price, cb, errorCb) {
    return function placeBidWithCustomer (err, customer) {
      if(customer === null) errorCb(400, err);
      else if(err) errorCb(400, err)
      else {
        getAuctionBidsWithinAuction(auctionId, 
          processBidsWrapper(auction, auctionId, customerId, price, cb, errorCb), 
          function(err){ errorCb(404, err); }
        );
      }
    }
  }

  function placeBidWithAuctionWrapper (auctionId, customerId, price, cb, errorCb) {
    return function pladeBidWithAuction (err, auction) {
      if(err) errorCb(404, err);
      else if(auction === null) errorCb(404, err);
      else if(auction.minimumPrice > price) errorCb(412, err);
      else if(new Date(auction.endDate) < new Date()) errorCb(403, err);
      else Customer.findById(customerId, placeBidWithCustomerWrapper(auction, auctionId, customerId, price, cb, errorCb));
    }
  }

  const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
    // Make sure auctionId and customerId are valid
    Auction.findById(auctionId, placeBidWithAuctionWrapper(auctionId, customerId, price, cb, errorCb));
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
