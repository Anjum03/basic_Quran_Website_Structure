
const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    appLanguage: {type : [String] ,enum :['English', 'Arabic' ]},
    aboutApp : String ,
    callUsOn :{type : [String] ,enum :['Email', 'WhatsApp' ]},
    followUsOn : {type : [String] ,enum :['Telegram', 'Twitter', 'YouTube', 'Instagram' ]},

} , { timestamps : true })

module.exports = mongoose.model('App', appSchema)