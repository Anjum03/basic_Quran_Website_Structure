

const mongoose = require('mongoose');
const quranAudioSchema = new mongoose.Schema({

    surahName: String,
  ayah :[
     {
    ayahNumber: {
      type: Number,
    },
    
    audioData: [
        {
            text: String,
            audio: String
        }
    ]

    }]
}, { timestamps: true })


module.exports = mongoose.model('QuranAudio', quranAudioSchema)