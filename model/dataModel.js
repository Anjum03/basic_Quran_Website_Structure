


const mongoose = require('mongoose');
const dataJsonSchema = new mongoose.Schema({
    surahName : String,
    transliteration : String,
    translation : String,
    ayahNumber : Number 



}, { timestamps: true })


module.exports = mongoose.model('DataJson', dataJsonSchema);