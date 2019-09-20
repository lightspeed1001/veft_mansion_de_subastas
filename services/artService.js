const Art = require('../data/db').Art;

const globalTryCatch = async cb => {
    try {
      return await cb();
    } catch(err) {
      return err;
    }
  }

const artService = () => {
    const getAllArts = async (cb, errorCb) => {
        return await globalTryCatch(async () => {
            const art = await Art.find({});
            return art;
        });
    };

    const getArtById = (id, cb, errorCb) => {
        // Your implementation goes here
    };

    const createArt = (art, cb, errorCb) => {
        // Your implementation goes here
    };

    return {
        getAllArts,
        getArtById,
        createArt
    };
};

module.exports = artService();
