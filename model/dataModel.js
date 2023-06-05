


const mongoose = require('mongoose');
const dataJsonSchema = new mongoose.Schema({
    surahName : String,
    transliteration : String,
    translation : String,
    total_verses : Number 



}, { timestamps: true })


module.exports = mongoose.model('DataJson', dataJsonSchema);