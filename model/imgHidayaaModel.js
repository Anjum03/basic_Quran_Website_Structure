
const mongoose = require('mongoose');
const imgHidayaaSchema = new mongoose.Schema({

    surahId : String, 
    surahName : String ,
    ayahNumber : Number ,
    ayahWord : String , 
    hidayaaText : String , 
    hidayaaImg : [String ], 
    hidayaaAudio : [String ], 
    hidayaaTag : {type : String , enum :['Tag' , 'No-Tag' ,], default : 'Tag'}

} , {timestamps : true})

module.exports = mongoose.model('imgHidayaa' , imgHidayaaSchema)
