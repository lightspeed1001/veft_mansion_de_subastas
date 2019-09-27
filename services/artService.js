const Art = require('../data/db').Art;
const Artist = require('../data/db').Artist;

const artService = () => {
  const getAllArts = async (cb, errorCb) => {
    Art.find({}, (err, result) => {
      if (err) {
        errorCb(500, 'Internal database error');
      } else {
        cb(result);
      }
    });
  };

  const getArtById = async (id, cb, errorCb) => {
    Art.findById(id, (err, result) => {
      if (err) {
        errorCb(500, 'Internal database error');
      } else if (result === null) {
        errorCb(404, 'Artist not found');
      } else {
        return cb(result);
      }
    });
  };

  const createArt = (art, cb, errorCb) => {
    Artist.findById(art.artistId, (err, result) => {
      if (err) {
        errorCb(500, 'Internal database error');
      } else if (result === null) {
        errorCb(400, 'Artist not found');
      } else {
        Art.create(art, function(err, result) {
          if (err) {
            return errorCb(500, 'Internal database error');
          } else {
            return cb();
          }
        });
      }
    });
  };

  return {
    getAllArts,
    getArtById,
    createArt
  };
};

module.exports = artService();
