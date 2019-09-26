const Artist = require('../data/db').Artist;

const artistService = () => {
  const getAllArtists = (cb, errorCb) => {
    Artist.find({}, function(err, result) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else {
        cb(result);
      }
    });
  };

  const getArtistById = (id, cb, errorCb) => {
    Artist.findById(id, function(err, result) {
      if (err) {
        errorCb(500, 'Internal database error');
      } else if (result === null) {
        errorCb(404, 'Artist not found');
      } else {
        cb(result);
      }
    });
  };

  const createArtist = (artist, cb, errorCb) => {
    Artist.create(artist, function(err, result) {
      if (err) {
        return errorCb(500, 'Internal database error');
      } else {
        return cb();
      }
    });
  };

  return {
    getAllArtists,
    getArtistById,
    createArtist
  };
};

module.exports = artistService();
