

require('dotenv').config();
const router = require('express').Router();
const Note = require('../model/addNoteModel');
const DataJson = require('../model/dataModel');
const Hidayaa = require('../model/hidayaModel');


//add Note
router.post('/:surahName/:hidayaId/addNote', async (req, res) => {

    const { surahName, hidayaId } = req.params;
    const { text } = req.body;
    try {

        const surah = await DataJson.findOne({ transliteration: surahName });

        if (!surah) {
            res.status(404).json({ success: false, msg: `SurahName not match` });
        }

        const hidyaa = await Hidayaa.findById(hidayaId);
        const hidayaText = hidyaa.hidayaText;

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const addNote = await Note.create({
           surahName: surah.transliteration,
            hidayaId: hidayaId,
            hidayaText: hidayaText,
            text: text
        });
//to remove array in hidaya response
        // const responseData = {
        //     ...addNote._doc,
        //     hidayaId: hidayaId,
        //     transliteration: surah.transliteration
        // };

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: addNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});



//update 
router.put('/:surahName/:hidayaId/addNote/:addNoteId', async (req, res) => {

    const { surahName, hidayaId , addNoteId} = req.params;
    const { text } = req.body;
    try {

        const surah = await DataJson.findOne({ transliteration: surahName });

        if (!surah) {
            res.status(404).json({ success: false, msg: `SurahName not match` });
        }

        const hidyaa = await Hidayaa.findById(hidayaId);
        const hidayaText = hidyaa.hidayaText;
        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const updateNote = await Note.findByIdAndUpdate( addNoteId , {
            $set :{
                surahName: surah.transliteration,
                hidayaId : hidayaId,
                hidayaText : hidayaText,
                text : text
            }
        } , {new : true})

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: updateNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});




//delete
router.delete('/:surahName/:hidayaId/addNote/:addNoteId', async (req, res) => {

    const { surahName, hidayaId , addNoteId} = req.params;
    const { text } = req.body;
    try {

        const surah = await DataJson.findOne({ transliteration: surahName });

        if (!surah) {
            res.status(404).json({ success: false, msg: `SurahName not match` });
        }

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const deleteNote = await Note.findByIdAndDelete(addNoteId)

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: deleteNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});




//get by Id 
router.get('/:surahName/:hidayaId/addNote/:addNoteId', async (req, res) => {

    const { surahName, hidayaId , addNoteId} = req.params;
    try {

        const surah = await DataJson.findOne({ transliteration: surahName });

        if (!surah) {
            res.status(404).json({ success: false, msg: `SurahName not match` });
        }

        const hidyaa = await Hidayaa.findById(hidayaId);

        if (!hidyaa) {
            res.status(404).json({ success: false, msg: `Hidaya not present` });
        }

        const deleteNote = await Note.findById(addNoteId)

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: deleteNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});



//get All
router.get('/:surahName/:hidayaId/addNote', async (req, res) => {

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

        const deleteNote = await Note.find()

        res.status(200).json({ success: true, msg: `Add Note Successfully`, data: deleteNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});

module.exports = router
