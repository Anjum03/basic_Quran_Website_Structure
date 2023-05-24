

const mongoose = require('mongoose');

const hidayaaSchema = new mongoose.Schema({

    surahName : String,
    hidayaaNumber : Number,
    ayah:[
        {
            ayahNumber : Number,
            ayahWord: String,
            hidayaText : String,
            hidayaaAudio: String,
            hidayaaTag : {type: String,}  
        }
    ]

},{timestamps : true})


module.exports = mongoose.model('Hidayaa', hidayaaSchema);