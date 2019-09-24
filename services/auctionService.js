const Auction = require('../data/db').Auction;

const auctionService = () => {
    const getAllAuctions = (cb, errorCb) => {
        Auction.find({}, function(err, auctions) {
            if (err) { errorCb(err); }
            else { cb(auctions); }
        })
    };

    const getAuctionById = (id, cb, errorCb) => {
        // Your implementation goes here
    };

    const getAuctionWinner = (auctionId, cb, errorCb) => {
        // Your implementation goes here
    };

	const createAuction = (auction, cb, errorCb) => {
        // Your implementation goes here
    };

	const getAuctionBidsWithinAuction = (auctionId, cb, errorCb) => {
        // Your implementation goes here
    };

	const placeNewBid = (auctionId, customerId, price, cb, errorCb) => {
		// Your implementation goes here
	}

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
