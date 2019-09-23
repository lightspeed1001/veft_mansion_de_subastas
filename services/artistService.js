const Artist = require('../data/db').Artist;

const artistService = () => {
    const getAllArtists = (cb, errorCb) => {
        try {
            return Artist.find({});
        } catch(err) {
            return err;
        }
    };

    const getArtistById = (id, cb, errorCb) => {
        try {
            return Artist.findById(id);
        } catch(err) {
            return err;
        }
    };

    const createArtist = (artist, cb, errorCb) => {
        Artist.create(artist, function(err, result) {
            if (err) {
                return errorCb();
            } else {
                return cb(result);
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
