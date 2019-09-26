const Customer = require('../data/db').Customer;
const AuctionBid = require('../data/db').AuctionBid;

const customerService = () => {
    const getAllCustomers = (cb, errorCb) => {
        Customer.find({}, function(err, customers) {
            if (err) { errorCb(500); }
            else { cb(customers); }
        })
    };

    const getCustomerById = (id, cb, errorCb) => {
        
        Customer.findById(id, function(err, customer) {
            if(err) { errorCb(500) }
            else if(customer === null) { errorCb(404); }
            else{ cb(customer); }
        });

    };

    const getCustomerAuctionBids = (customerId, cb, errorCb) => {
        getCustomerById(customerId, function(customer) {
            if(customer === null) { errorCb(404) }
            else {
                bids = AuctionBid.find({ customerId: customerId }, function(err, bids){
                    if(err) { errorCb(500) }
                    else {
                        cb(bids);
                    }
                });
            }
        }, function(err) {
            errorCb(500);
        });
    };

	const createCustomer = (customer, cb, errorCb) => {
        Customer.create(customer, function(err, result) {
            if (err) { errorCb(500); } 
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
