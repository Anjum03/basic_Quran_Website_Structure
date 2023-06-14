


const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
    dataId : String,
    surahName : String,
    hidayaId : [ { type: mongoose.Schema.Types.ObjectId, ref: 'Hidayaa'}],
    text : String 

}, { timestamps: true })


module.exports = mongoose.model('Note', noteSchema);