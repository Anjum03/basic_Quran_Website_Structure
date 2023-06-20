

require('dotenv').config();
const router = require('express').Router();
const Note = require('../model/addNoteModel');
const Hidayaa = require('../model/hidayaModel');
const DeviceToken = require('../model/deviceModel');

//add multer in future
//add Note
router.post('/:hidayaId/addNote/:deviceToken', async (req, res) => {

    const {  hidayaId , deviceToken } = req.params;
    const { text } = req.body;
    try {

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }

        const addNote = await Note.create({
            surahName: hidyaa.surahName,
            deviceToken : hidyaa.deviceToken ,
            hidayaId: hidyaa.hidayaId,
            hidayaText: hidyaa.hidayaText,
            text: text
        });


        res.status(200).json({ success: true, msg: `Add Note Successfully`,deviceToken: founDeviceToken.deviceToken, data: addNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});



//update 
router.put('/:hidayaId/:deviceToken/:addNoteId', async (req, res) => {

    const { deviceToken, hidayaId , addNoteId} = req.params;
    const { text } = req.body;
    try {

        const hidyaa = await Hidayaa.findById(hidayaId);
        const hidayaText = hidyaa.hidayaText;
        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }

        const updateNote = await Note.findByIdAndUpdate( addNoteId , {
            $set :{
               deviceToken :deviceToken,
                hidayaId : hidayaId,
                hidayaText : hidayaText,
                text : text
            }
        } , {new : true})

        res.status(200).json({ success: true, msg: `Add Note Successfully`, deviceToken : founDeviceToken, data: updateNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});




//delete
router.delete('/:hidayaId/:deviceToken/:addNoteId', async (req, res) => {

    const { deviceToken, hidayaId , addNoteId} = req.params;
    try {

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }
        
        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }

        const deleteNote = await Note.findByIdAndDelete(addNoteId)

        res.status(200).json({ success: true, msg: `Add Note Successfully`,
        deviceToken : founDeviceToken, data: deleteNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});




//get by Id 
router.get('/:hidayaId/:deviceToken/:addNoteId', async (req, res) => {

    const { deviceToken, hidayaId , addNoteId} = req.params;
    try {

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }

        const deleteNote = await Note.findById(addNoteId)

        res.status(200).json({ success: true, msg: `Add Note Successfully`, deviceToken : founDeviceToken, data: deleteNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});



//get All
router.get('/:deviceToken/addNote', async (req, res) => {

    const { deviceToken } = req.params;
    try {

        const founDeviceToken = await DeviceToken.findOne({ deviceToken: deviceToken });

        if (!founDeviceToken) {
            res.status(404).json({ success: false, msg: `deviceToken not match` });
        }
      
        const deleteNote = await Note.find()

        res.status(200).json({ success: true, msg: `Add Note Successfully`, deviceToken : founDeviceToken, data: deleteNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});

module.exports = router
