require('dotenv').config();
const router = require("express").Router();
const DataJson = require('../model/dataModel');



// register 

router.post('/addData', async (req, res) => {
    try {

        const jsonData = [
            { "id":1,
              "surahName": "الفاتحة",
              "transliteration": "Al-Fatihah",
              "translation": "The Opener",
              "total_verses": 7
            },
            {"id":2,
              "surahName": "البقرة",
              "transliteration": "Al-Baqarah",
              "translation": "The Cow",
              "total_verses": 286
            },
            {"id":3,
              "surahName": "آل عمران",
              "transliteration": "Al 'Imran",
              "translation": "Family of Imran",
              "total_verses": 200
            },
            {"id":4,
              "surahName": "النساء",
              "transliteration": "An-Nisa",
              "translation": "The Women",
              "total_verses": 176
            },
            {"id":5,
              "surahName": "المائدة",
              "transliteration": "Al-Ma'idah",
              "translation": "The Table Spread",
              "total_verses": 120
            },
            {"id":6,
              "surahName": "الأنعام",
              "transliteration": "Al-An'am",
              "translation": "The Cattle",
              "total_verses": 165
            },
            {"id":7,
              "surahName": "الأعراف",
              "transliteration": "Al-A'raf",
              "translation": "The Heights",
              "total_verses": 206
            },
            {"id":8,
              "surahName": "الأنفال",
              "transliteration": "Al-Anfal",
              "translation": "The Spoils of War",
              "total_verses": 75
            },
            {"id":9,
              "surahName": "التوبة",
              "transliteration": "Al-Tawbah",
              "translation": "The Repentance",
              "total_verses": 129
            },
            { "id":10,
              "surahName": "يونس",
              "transliteration": "Yunus",
              "translation": "Jonah",
              "total_verses": 109
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