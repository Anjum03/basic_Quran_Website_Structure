

require('dotenv').config();
const router = require('express').Router();
const QuranAudio = require('../model/QuranAudioModel');
const data = require('../data.json');

// to get all surahName and Ayat No  // first Page

router.get('/all/AyahList', async (req, res) => {
    try {
           // Find the Surah by surahName in the data from data.json
           const surah = data.map((item) =>{
             return{
                surahName : item.transliteration,
                ayahCount : item.total_verses
             }
           })
        res.status(200).json({ success: true, msg: 'SurahList with Ayah', hidayaData: surah });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
});


//second page // all dat of audios 
router.get('/QuranAudio/AllData', async (req, res) => {

    try {

        const allQuranAudio = await QuranAudio.find()

        if (allQuranAudio.length === 0) {
            return res.status(400).json({ success: false, msg: ` No Quran Audio list  `, });
        }
      
        return res.status(200).json({ success: true, msg: ` All Surah list  `, data: allQuranAudio });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Server Error ` })
    }

});


//getById
router.get('/quranAudio/:surahName/:ayahNumber/audio/:audioId', async (req, res) => {

    try {
        const surahName = req.params.surahName;
        const ayahNumber = req.params.ayahNumber;

        const oneQuranAudio = req.params.audioId;
        // Find the Surah by surahName in the data from data.json
        const surah = data.find((item) => item.transliteration === surahName);
        const ayahNum = data.find((item) => item.transliteration === ayahNumber);

        if (!surah) {
            return res.status(404).json({ success: false, msg: 'Surah not found' });
        }
        if (!ayahNum) {
            return res.status(404).json({ success: false, msg: 'ayahNumber not found' });
        }
        const singleQuranAudio = await QuranAudio.findById(oneQuranAudio);
        if (!oneQuranAudio) {

            return res.status(400).json({ success: false, msg: ` No Quran Audio list  `, });
        }
        return res.status(200).json({ success: true, msg: ` All Surah, Hidayaa and ayah `, data: singleQuranAudio });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }

})



//surah list  //first page
// router.post('/surahList', async (req,res) => {

//     try{
//         const {surahName, totalAyah} = req.body ;
//         const surahList = await QuranAudio.create({  surahName, totalAyah });
//         return res.status(200).json({ success: true, msg: `Surah list created `, data: surahList});

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, msg: `Server Error ` })
//     }
// });


//add new audio QuranAudio
router.post('/quranAudio/:surahName/:ayahNumber/audio', async (req, res) => {
    try {
      const surahName = req.params.surahName;
      const ayahNumber = parseInt(req.params.ayahNumber);
      const { text, audio } = req.body;
  
      // Find the Surah by surahName in the data from data.json
      const surah = data.find((item) => item.transliteration === surahName);
  
      if (!surah) {
        return res.status(404).json({ success: false, msg: 'Surah not found' });
      }
  
      if (ayahNumber < 1 || ayahNumber > surah.total_verses) {
        return res.status(404).json({ success: false, msg: 'Invalid ayahNumber' });
      }
  
      const audioList = await QuranAudio.create({
        surahName,
        ayah: [
          {
            ayahNumber,
            audioData: [
              {
                text,
                audio,
              },
            ],
          },
        ],
      });
  
      return res.status(200).json({ success: true, msg: 'Audio list created', data: audioList });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: 'Server Error' });
    }
  });
  



//update QuranAudio
router.put('/quranAudio/:surahName/:ayahNumber/audio/:audioId', async (req, res) => {
    try {
      const surahName = req.params.surahName;
      const ayahNumber = parseInt(req.params.ayahNumber);
      const audioId = req.params.audioId;
      const {audioData } = req.body;
  
      // Find the Surah by surahName in the data from data.json
      const surah = data.find((item) => item.transliteration === surahName);
  
      if (!surah) {
        return res.status(404).json({ success: false, msg: 'Surah not found' });
      }
  
      if (ayahNumber < 1 || ayahNumber > surah.total_verses) {
        return res.status(404).json({ success: false, msg: 'Invalid ayahNumber' });
      }
  
      const audioFind = await QuranAudio.findById(audioId, );
  
      if (!audioFind) {
        return res.status(404).json({ success: false, msg: 'Audio not found' });
      }
      
      // Update the hidaya fields
      audioFind.surahName = surahName;
      audioFind.ayahNumber = ayahNumber;
      audioFind.ayah[0].audioData = audioData;
  
      const audioUpdated = await audioFind.save();
      return res.status(200).json({ success: true, msg: 'Surah list Updated', data: audioUpdated });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: 'Server Error' });
    }
  });
  
  



//delete QuranAudio
router.delete('/quranAudio/:surahName/:ayahNumber/audio/:audioId', async (req, res) => {
    try {

        const surahName = req.params.surahName;
        const ayahNumber = parseInt(req.params.ayahNumber);
        const audioId = req.params.audioId;

        // Find the Surah by surahName in the data from data.json
        const surah = data.find((item) => item.transliteration === surahName);

        // const ayahNum = data.find((item) => item.total_verses.length === ayahNumber);

        if (!surah) {
            return res.status(404).json({ success: false, msg: 'Surah not found' });
        }
        if (ayahNumber < 1 || ayahNumber > surah.total_verses) {
          return res.status(404).json({ success: false, msg: 'Invalid ayahNumber' });
        }

        const audioFind = await QuranAudio.findByIdAndDelete(audioId);

        if (!audioFind) {
            return res.status(404).json({ success: false, msg: 'Audio not found' });
        }
      
        res.status(200).json({ success: true, msg: `Audio Deleted`, data: audioFind })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }


})

module.exports = router;