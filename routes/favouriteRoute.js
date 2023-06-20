
require('dotenv').config();
const router = require('express').Router();
const Favourite = require('../model/favouriteModel');
const DataJson = require('../model/dataModel');
const Hidayaa = require('../model/hidayaModel');
const DeviceToken = require('../model/deviceModel');
// const multer = require('multer')

// //multer storge 
// const storage = multer.memoryStorage(); //Store files in memory instead of saving them to disk
// const upload = multer ({
//   storage : storage 
// });


//add Favourite
router.post('/:hidayaId/addFavourite/:deviceToken', async (req, res) => {

    const {  hidayaId, deviceToken } = req.params;
    try {

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `HidayaId not present` });
        }

        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }

        const addFavourite = await Favourite.create({
            surahName: hidyaa.surahName,
            ayahNumber: hidyaa.ayahNumber,
            ayahWord: hidyaa.ayahWord,
            hidayaText: hidyaa.hidayaText,
            hidayaaAudio: hidyaa.hidayaaAudio
        });

        res.status(200).json({ success: true, msg: `Add Note Successfully`, deviceToken: founDeviceToken.deviceToken, data: addFavourite });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

})



//delet Favourite
router.delete('/:hidayaId/:deviceToken/:addFavouriteId', async (req, res) => {

    const {  hidayaId, addFavouriteId , deviceToken } = req.params;
    try {

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }

        const addFavourite = await Favourite.findByIdAndDelete(addFavouriteId);

        res.status(200).json({ success: true, msg: `Add Note Successfully`,  deviceToken : founDeviceToken, data: addFavourite });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});




//get ALl
router.get('/addFavourite/:deviceToken', async (req, res) => {

    const { deviceToken } = req.params;
    try {

        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }

        const addFavourite = await Favourite.find();

        res.status(200).json({ success: true, msg: `Add Note Successfully`,  deviceToken : founDeviceToken, data: addFavourite });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});


module.exports = router;