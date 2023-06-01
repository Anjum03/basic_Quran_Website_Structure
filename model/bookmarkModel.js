


const mongoose = require('mongoose');
const bookmarkSchema = new mongoose.Schema({

bookmark :  String,
hidaya : [ { type: mongoose.Schema.Types.ObjectId, ref: 'Hidayaa'}]

}, { timestamps: true })


module.exports = mongoose.model('Bookmark', bookmarkSchema);