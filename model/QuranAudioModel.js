

const mongoose = require('mongoose');
const quranAudioSchema = new mongoose.Schema({

    // surahName: { type: String,   alias : 'transliteration' },
    // totalAyah: {  type: Number, alias : 'total_verses' },
    // audio: [
    //     {
            text: String,
            audio: String
        // }]
}, { timestamps: true })


module.exports = mongoose.model('QuranAudio', quranAudioSchema)