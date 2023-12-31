require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const QuranAudio = require('../model/QuranAudioModel');
const DataJson = require('../model/dataModel');
const multer = require('multer')

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage
});


// cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
// to get all surahName and Ayat No  // first Page

router.get('/all/AyahList', async (req, res) => {
  try {
    // Find the Surah by surahName in the data from data.json
    const surahs = await DataJson.find({}, { _id: 1, transliteration: 1, ayahNumber: 1 });

    if (!surahs) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    const surahData = await Promise.all(
      surahs.map(async (surah) => {
        const ayahs = await QuranAudio.find({ dataId: surah._id });
        return {
          dataId: surah._id,
          surahName: surah.transliteration,
          ayahCount: surah.ayahNumber,
          ayahs: ayahs.map((ayah) => ayah),
        };
      })
    );
    res.status(200).json({ success: true, msg: 'SurahList with Ayah', hidayaData: surahData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});




//second page // all dat of audios 
// router.get('/QuranAudio/AllData/:dataId', async (req, res) => {

//   try {
//     const dataId = req.params.dataId;

//     // Find the Surah by surahName in the data from data.json
//     const surah = await DataJson.findById(dataId);

//     if (!surah) {
//       return res.status(404).json({ success: false, msg: 'Surah not found' });
//     }

//     const allQuranAudio = await QuranAudio.find({ dataId: dataId });

//     if (allQuranAudio.length === 0) {
//       return res.status(400).json({ success: false, msg: 'No Quran Audio list' });
//     }

//     // const ayahs = await Promise.all(
//     //   allQuranAudio.map(async (allQuranAudios) => {
//     //     const ayahs = await QuranAudio.find({ surahName: allQuranAudios.transliteration });
//     //     return ayahs;
//     //   })
//     // );

//     return res.status(200).json({ success: true, msg: ` All Surah list  `, data: allQuranAudio });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, msg: `Server Error ` })
//   }

// });

router.get('/QuranAudio/:dataId', async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const quranAudio = await QuranAudio.find({ dataId: dataId });

    const surah = await DataJson.findOne({ _id: dataId });

    if (!surah) {
      // If surah is not found, return an error response
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    return res.status(200).json({ success: true, msg: 'Quran Audio list', surahName: surah.transliteration, data: quranAudio });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});


router.get('/quranAudio/:dataId/audio/:audioId', async (req, res) => {

  try {
    const dataId = req.params.dataId;

    const quranAudio = await QuranAudio.findOne({ dataId: dataId });

    if (!quranAudio) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }
    const oneQuranAudio = req.params.audioId;
    // Find the Surah by surahName in the data from data.json


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



//getById
router.get('/quranAudio/:surahName/:ayahNumber/audio/:audioId', async (req, res) => {

  try {
    const surahName = req.params.surahName;
    const ayahNumber = req.params.ayahNumber;

    const oneQuranAudio = req.params.audioId;
    // Find the Surah by surahName in the data from data.json
    const surah = data.find((item) => item.transliteration === surahName);

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }
    const verse = data.find((item) => item.ayahNumber === ayahNumber);
    if (!verse) {
      return res.status(400).json({ success: false, msg: 'Ayah Number Not Found' });
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



//add new audio QuranAudio
// router.post('/quranAudio/:dataId/:ayahNumber/audio',upload.single('audio'), async (req, res) => {
//   try {
//     const dataId = req.params.dataId;
//     const ayahNumber = (req.params.ayahNumber);
//     const { text, } = req.body;

//     // Find the Surah by surahName in the data from data.json
//     const surah = await  DataJson.findById(dataId).exec();

//     if (!surah) {
//       return res.status(404).json({ success: false, msg: 'Surah not found' });
//     }
//      // Find the verse by dataId and ayahNumber in the surah
//      // Find the verse by dataId and ayahNumber in the surah
//      // Check if the ayahNumber is within the range of valid verses
//      const ayahNumberData = await DataJson.find(ayahNumber);

//      if (!ayahNumberData) {
//        return res.status(404).json({ success: false, msg: 'AyahNumber not found' });
//      }
//     //  if (ayahNumber < 1 || ayahNumber > surah.ayahNumber) {
//     //   return res.status(400).json({ success: false, msg: 'Invalid Ayah Number' });
//     // }



//     const audioList = await QuranAudio.create({
//       dataId: dataId,
//       surahName: surah.transliteration,
//       ayahNumber: ayahNumber,
//       text: text,
//       audio:req.file.originalname ,

//     });

//     return res.status(200).json({ success: true, msg: 'Audio list created', data: audioList });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, msg: 'Server Error' });
//   }
// });

router.post('/quranAudio/:dataId/audio', async (req, res) => {

  let audioUrl, audioPublicId;

  // Check if hidayaaAudio file exists in the request
  if (req.files && req.files.audio) {
    const result = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
      resource_type: 'video',
      resource_type: 'auto'
    });

    audioUrl = result.url;
    audioPublicId = result.public_id;
  }
  try {
    const dataId = req.params.dataId;
    const { text, ayahNumber } = req.body;

    // Find the Surah by surahName in the data from data.json
    const surah = await DataJson.findById(dataId).exec();

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }
    // if (surah.ayahNumber !== ayahNumber) {
    //   return res.status(404).json({ success: false, msg: 'Verse not found' });
    // }

    // let audio = await QuranAudio.findOne({ _id: dataId, ayahNumber });

    // if (audio) {
    //   return res.status(200).json({ success: false, msg: 'Audio entry already exists' });
    // }

    audio = await QuranAudio.create({
      dataId: dataId,
      ayahNumber: ayahNumber,
      surahName: surah.transliteration,
      text: text,
      audio: audioUrl || undefined,
      audio_public_id: audioPublicId || undefined
    });

    return res.status(200).json({ success: true, msg: 'Audio list created', data: { dataId, /*...*/audio/*.toJSON()*/ } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: 'Server Error' });
  }
});





//update QuranAudio
router.put('/quranAudio/:dataId/audio/:audioId', async (req, res) => {
  let audioUrl, audioPublicId;

  // Check if hidayaaAudio file exists in the request
  if (req.files && req.files.audio) {
    const result = await cloudinary.uploader.upload(req.files.audio.tempFilePath, {
      resource_type: 'video',
      resource_type: 'auto'
    });

    audioUrl = result.url;
    audioPublicId = result.public_id;
  }
  try {
    const dataId = req.params.dataId;
    const audioId = req.params.audioId;
    const { text, ayahNumber } = req.body;
    // const { audioData } = req.body;

    // Find the Surah by surahName in the data from data.json
    const surah = DataJson.findById(dataId);

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }


    let audioFind = await QuranAudio.findOne({ dataId, ayahNumber });

    audioFind = await QuranAudio.findByIdAndUpdate(audioId, {
      $set: {
        dataId: dataId,
        ayahNumber: ayahNumber,
        surahName: surah.transliteration,
        text: text,
        audio: audioUrl || undefined,
        audio_public_id: audioPublicId || undefined
      }
    }, { new: true });

    if (!audioFind) {
      return res.status(404).json({ success: false, msg: 'Audio not found' });
    }

    // Update the hidaya fields
    // audioFind.surahName = surah.transliteration;
    // audioFind.ayahNumber = surah.ayahNumbresult.urlresult.urlresult.urler

    const audioUpdated = await audioFind.save();
    return res.status(200).json({ success: true, msg: 'Surah list Updated', data: audioUpdated });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: 'Server Error' });
  }
});



//delete QuranAudio
router.delete('/quranAudio/:dataId/audio/:audioId', async (req, res) => {
  try {

    const dataId = req.params.dataId;
    const audioId = req.params.audioId;

    // Find the Surah by surahName in the data from data.json
    const surah = await DataJson.findById(dataId);

    // const ayahNum = data.find((item) => item.ayahNumber.length === ayahNumber);

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }


    const audioFind = await QuranAudio.findByIdAndDelete(audioId);

    if (!audioFind) {
      return res.status(404).json({ success: false, msg: 'Audio not found' });
    }
    if (audioFind.audio_public_id) {
      await cloudinary.uploader.destroy(audioFind.audio_public_id);
    }

    res.status(200).json({ success: true, msg: `Audio Deleted`, data: audioFind })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: `Server Error ` })
  }


})

module.exports = router;