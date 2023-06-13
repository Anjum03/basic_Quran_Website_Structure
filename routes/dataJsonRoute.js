require('dotenv').config();
const router = require("express").Router();
const DataJson = require('../model/dataModel');



// register 

router.post('/data', async (req, res) => {
    try {

        const jsonData = [
            { "id":1,
              "surahName": "الفاتحة",
              "transliteration": "Al-Fatihah",
              "translation": "The Opener",
              "ayahNumber": 7
            },
            {"id":2,
              "surahName": "البقرة",
              "transliteration": "Al-Baqarah",
              "translation": "The Cow",
              "ayahNumber": 286
            },
            {"id":3,
              "surahName": "آل عمران",
              "transliteration": "Al 'Imran",
              "translation": "Family of Imran",
              "ayahNumber": 200
            },
            {"id":4,
              "surahName": "النساء",
              "transliteration": "An-Nisa",
              "translation": "The Women",
              "ayahNumber": 176
            },
            {"id":5,
              "surahName": "المائدة",
              "transliteration": "Al-Ma'idah",
              "translation": "The Table Spread",
              "ayahNumber": 120
            },
            {"id":6,
              "surahName": "الأنعام",
              "transliteration": "Al-An'am",
              "translation": "The Cattle",
              "ayahNumber": 165
            },
            {"id":7,
              "surahName": "الأعراف",
              "transliteration": "Al-A'raf",
              "translation": "The Heights",
              "ayahNumber": 206
            },
            {"id":8,
              "surahName": "الأنفال",
              "transliteration": "Al-Anfal",
              "translation": "The Spoils of War",
              "ayahNumber": 75
            },
            {"id":9,
              "surahName": "التوبة",
              "transliteration": "Al-Tawbah",
              "translation": "The Repentance",
              "ayahNumber": 129
            },
            { "id":10,
              "surahName": "يونس",
              "transliteration": "Yunus",
              "translation": "Jonah",
              "ayahNumber": 109
            }
          ]
          
    const result = await DataJson.insertMany(jsonData);
        return res.status(200).json({ success: true, msg: `Data Add Successfully .. :) `, data: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }


});

module.exports = router