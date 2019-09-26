const Customer = require('../data/db').Customer;
const AuctionBid = require('../data/db').AuctionBid;

const customerService = () => {
  const getAllCustomers = (cb, errorCb) => {
    Customer.find({}, function(err, customers) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else {
        cb(customers);
      }
    });
  };

  const getCustomerById = (id, cb, errorCb) => {
    Customer.findById(id, function(err, customer) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else if (customer === null) {
        errorCb(404, 'Customer not found');
      } else {
        cb(customer);
      }
    });
  };

  const getCustomerAuctionBids = (customerId, cb, errorCb) => {
    getCustomerById(
      customerId,
      function(customer) {
        bids = AuctionBid.find({ customerId: customerId }, function(err, bids) {
          if (err) {
            errorCb(500, err);
          } else {
            cb(bids);
          }
        });
      },
      function(status, err) {
        errorCb(status, err);
      }
    );
  };

  const createCustomer = (customer, cb, errorCb) => {
    Customer.create(customer, function(err, result) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else {
        return cb();
      }
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
