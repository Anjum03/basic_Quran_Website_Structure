

const mongoose = require('mongoose');

const hidayaaSchema = new mongoose.Schema({
  dataId: {
    type: String,
  },
  surahName: String,
  ayahNumber: {type: Number,},
  ayahWord: String,
  hidayaText: String,
  hidayaaAudio: String,
  noteText : String,
  isfavourite :Boolean ,
  hidayaaTag: {
    type: String,
    enum: ['No-Tag', 'Tag'],
    default: 'Tag',
  },



  // hidayaaNumber : Number, //automaticall num catch from db

  // ayah:[
  //     {
  // ayahNumber: {
  //     type: Number,
  //     ayahDetails : [{
  //         ayahWord: String,
  //         hidayaText: String,
  //         hidayaaAudio: String,
  //         hidayaaTag: { type: String, enum: ['No-Tag', 'Tag'], default: 'No-Tag' }
  //     }]
  // }
  //create array of object 
  //     }
  // ]

}, { timestamps: true })


module.exports = mongoose.model('Hidayaa', hidayaaSchema);