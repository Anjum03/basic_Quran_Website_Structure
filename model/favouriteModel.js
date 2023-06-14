

const mongoose = require('mongoose');
const favouriteSchema = new mongoose.Schema({
    // dataId: String,
    hidyaa : { type: mongoose.Schema.Types.ObjectId, ref: 'Hidayaa'},
    surahName: String,
    ayahNumber: { type: Number, },
    ayahWord: String,
    hidayaText: String,
    hidayaaAudio: String,

}, { timestamps: true })


module.exports = mongoose.model('Favourite', favouriteSchema);