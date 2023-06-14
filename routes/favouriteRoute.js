
require('dotenv').config();
const router = require('express').Router();
const Favourite = require('../model/favouriteModel');
const DataJson = require('../model/dataModel');
const Hidayaa = require('../model/hidayaModel');
// const multer = require('multer')

// //multer storge 
// const storage = multer.memoryStorage(); //Store files in memory instead of saving them to disk
// const upload = multer ({
//   storage : storage 
// });


//add Favourite
router.post('/:surahName/:hidayaId/addFavourite', async (req, res) => {

    const { surahName, hidayaId } = req.params;
    try {

        const surah = await DataJson.findOne({ transliteration: surahName });

        if (!surah) {
            res.status(404).json({ success: false, msg: `SurahName not match` });
        }

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const addFavourite = await Favourite.create({
            ...hidyaa._doc
        });

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: addFavourite });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

})



//delet Favourite
router.delete('/:surahName/:hidayaId/addFavourite/:addFavouriteId', async (req, res) => {

    const { surahName, hidayaId, addFavouriteId } = req.params;
    try {

        const surah = await DataJson.findOne({ transliteration: surahName });

        if (!surah) {
            res.status(404).json({ success: false, msg: `SurahName not match` });
        }

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const addFavourite = await Favourite.findByIdAndDelete(addFavouriteId);

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: addFavourite });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});




//get ALl
router.get('/:surahName/:hidayaId/addFavourite', async (req, res) => {

    const { surahName, hidayaId, } = req.params;
    try {

        const surah = await DataJson.findOne({ transliteration: surahName });

        if (!surah) {
            res.status(404).json({ success: false, msg: `SurahName not match` });
        }

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const addFavourite = await Favourite.find();

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: addFavourite });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});


module.exports = router;