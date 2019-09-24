const Customer = require('../data/db').Customer;
const AuctionBid = require('../data/db').AuctionBid;

const customerService = () => {
    const getAllCustomers = (cb, errorCb) => {
        Customer.find({}, function(err, customers) {
            if (err) { errorCb(err); }
            else { cb(customers); }
        })
    };

    const getCustomerById = (id, cb, errorCb) => {
        Customer.findById(id, function(err, customer) {
            if(err) { throw new Error(err) }
            else if(customer === null) { errorCb(); }
            else{ cb(customer); }
        })
    };

    // TODO Doesn't work!
    const getCustomerAuctionBids = (customerId, cb, errorCb) => {
        getCustomerById(customerId, function(customer) {
            if(customer === null) {  }
            else {
                // Fara í auctionbid.js
                bids = AuctionBid.find(bid => bid.customerId == customerId, function(err, bids){
                    if(err) { throw new Error(err); }
                    else {
                        cb(bids);
                    }
                });
            }
        }, function(err) {
            // customer not found
            errorCb();
        });
    };

	const createCustomer = (customer, cb, errorCb) => {
        Customer.create(customer, function(err, result) {
            if (err) { errorCb(err); } 
            else { return cb(result); }
        });
    };

    return {
        getAllCustomers,
        getCustomerById,
        getCustomerAuctionBids,
		createCustomer
    };
};

module.exports = customerService();
