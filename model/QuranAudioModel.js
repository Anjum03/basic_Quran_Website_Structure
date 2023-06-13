

const mongoose = require('mongoose');
const quranAudioSchema = new mongoose.Schema({
  dataId: {
    type: String,
  },
  surahName: String,
  ayahNumber: {
    type: Number,
  },
  text: String,
  audio: String

}, { timestamps: true })


module.exports = mongoose.model('QuranAudio', quranAudioSchema)