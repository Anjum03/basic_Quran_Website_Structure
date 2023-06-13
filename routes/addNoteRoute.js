

require('dotenv').config();
const router = require('express').Router();
const Note = require('../model/addNoteModel');

router.post('/:surahName/:hidayaId/addNote', async (req, res) => {

    const { surahName, hidayaId } = req.params;
    const { text } = req.body;
    try {

        

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' })
    }

});

module.exports = router
