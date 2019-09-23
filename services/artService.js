const Art = require('../data/db').Art;

const artService = () => {
    const getAllArts = async (cb, errorCb) => {
        try {
            return await Art.find({});
        } catch(err) {
            return err;
        }
    };

    const getArtById = async (id, cb, errorCb) => {
        try {
            return await Art.findById(id);
        } catch(err) {
            return err;
        }
    };

    const createArt = (art, cb, errorCb) => {
        Art.create(art, function(err, result) {
            if (err) {
                return errorCb();
            } else {
                return cb(result);
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
