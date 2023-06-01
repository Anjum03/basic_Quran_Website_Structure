
const mongoose = require('mongoose');

const deviceShcema = new mongoose.Schema({

    deviceToken:{ type : String ,  required : true,}

})

module.exports = mongoose.model('Devices', deviceShcema);
