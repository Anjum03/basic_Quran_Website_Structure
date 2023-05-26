

const mongoose = require('mongoose');

const staticShecma = new mongoose.Schema ({

    monthlyData :{
        appUsageRate :[ Number] ,
        appUsageinNumber : Number ,
        activeNotification : Number 
    }, 
    appUsageLangauge :{
        Arabic : Number,
       English: Number,
    },
    mostDownloadedMonthly :{
        surah : String ,
        AyahNumber : Number ,
        Hidayaa : String , 
        DownloadedNumber : Number
    } , 
    mostShareWeekly : {
        surah : String ,
        AyahNumber : Number ,
        Hidayaa : String , 
        sharedNumber : Number
    }

});

module.exports = mongoose.model('Statics', staticShecma);
