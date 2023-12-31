require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const DataJson = require('../model/dataModel');
const Note = require('../model/addNoteModel');
const Favourite = require('../model/favouriteModel');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// const upload = require("../multer");

//get all surah list
// GET request to retrieve surah data including hidayas

//gaet all data if favourite present in db
// router.get('/all/surahList', async (req, res) => {
//   try {

//     // Find the Surah by dataId in the data from data.json
//     const surahs = await DataJson.find({}, { _id: 1, transliteration: 1, });

//     if (!surahs) {
//       return res.status(404).json({ success: false, msg: 'Surah not found' });
//     }

//     const note = await Note.findOne({noteText : Note.text})

//   const isfavourite = await Favourite.find()


//     const responseData = await Promise.all(
//       surahs.map(async (surah) => {
//         const hidayas = await Hidayaa.find({
//           dataId: surah._id
//         });
//         return {
//           dataId: surah._id,
//           surahName: surah.transliteration,
//           hidayaCount: hidayas.length,
//           hidayas: hidayas.map((hidaya) => hidaya),
//           noteText : note ? note.text : '',
//           isfavourite : isfavourite ? isfavourite : false,
//         }
//       })
//     )
//     // Find hidayas associated with the surah


//     res.status(200).json({ success: true, msg: 'Surah Details', surahData: responseData, });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, msg: 'Server Error' });
//   }
// });

//if favourite have data show true and otherwise false 
 router.get('/all/surahList', async (req, res) => {
  try {

    // Find the Surah by dataId in the data from data.json
    const surahs = await DataJson.find({}, { _id: 1, transliteration: 1, });

    if (!surahs) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    const note = await Note.findOne({noteText : Note.text})

    let isFavourite = false; // Initialize the isFavourite flag to false

    const favouriteCount = await Favourite.countDocuments();
    if (favouriteCount > 0) {
      isFavourite = true; // Set the flag to true if there is data in the Favourite collection
    }


    const responseData = await Promise.all(
      surahs.map(async (surah) => {
        const hidayas = await Hidayaa.find({
          dataId: surah._id
        });
        return {
          dataId: surah._id,
          surahName: surah.transliteration,
          hidayaCount: hidayas.length,
          hidayas: hidayas.map((hidaya) => hidaya),
          noteText : note ? note.text : '',
          isfavourite : isFavourite 

        }
      })
    )
    // Find hidayas associated with the surah


    res.status(200).json({ success: true, msg: 'Surah Details', surahData: responseData, });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});



// Add new hidaya to a specific surah

router.post('/surahs/:dataId/hidayas', async (req, res) => {
  const { ayahNumber, ayahWord, hidayaText, hidayaaTag } = req.body;
  let audioUrl, audioPublicId;

  // Check if hidayaaAudio file exists in the request
  if (req.files && req.files.hidayaaAudio) {
    const result = await cloudinary.uploader.upload(req.files.hidayaaAudio.tempFilePath, {
      resource_type: 'video',
      resource_type: 'auto'
    });

    audioUrl = result.url;
    audioPublicId = result.public_id;
  }

  try {
    const dataId = req.params.dataId;

    // Find the Surah by dataId in the data from data.json
    const surah = await DataJson.findById(dataId).exec();

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    // Create a new hidaya using the Hidayaa model
    const newHidaya = await Hidayaa.create({
      dataId: dataId,
      surahName: surah.transliteration,
      ayahNumber,
      ayahWord,
      hidayaText,
      hidayaaTag,
      hidayaaAudio: audioUrl || undefined,
      audio_public_id: audioPublicId || undefined ,
      // noteText : Note.text
    });

    res.status(200).json({
      success: true,
      msg: 'New hidaya is created',
      newHidaya: newHidaya,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});




//update hidaya
router.put('/surahs/:dataId/hidayas/:hidayaId', async (req, res) => {
  const { ayahNumber, ayahWord, hidayaText, hidayaaTag } = req.body;
  const { hidayaId } = req.params;
  let audioUrl, audioPublicId;

  // Check if hidayaaAudio file exists in the request
  if (req.files && req.files.hidayaaAudio) {
    const result = await cloudinary.uploader.upload(req.files.hidayaaAudio.tempFilePath, {
      resource_type: 'video',
      format: 'mp3',
      resource_type: 'auto'
    });

    audioUrl = result.url;
    audioPublicId = result.public_id;
  }

  try {
    // Find the Hidayaa by hidayaId
    const hidaya = await Hidayaa.findById(hidayaId).exec();

    if (!hidaya) {
      return res.status(404).json({ success: false, msg: 'Hidayaa not found' });
    }

    // Delete the old audio file from Cloudinary
    if (hidaya.audio_public_id) {
      await cloudinary.uploader.destroy(hidaya.audio_public_id);
    }

    // Update the hidaya fields
    hidaya.ayahNumber = ayahNumber;
    hidaya.ayahWord = ayahWord;
    hidaya.hidayaText = hidayaText;
    hidaya.hidayaaTag = hidayaaTag;
    hidaya.hidayaaAudio = audioUrl || hidaya.hidayaaAudio;
    hidaya.audio_public_id = audioPublicId || hidaya.audio_public_id;

    // Save the updated hidaya
    await hidaya.save();

    res.status(200).json({
      success: true,
      msg: 'Hidayaa updated successfully',
      updatedHidaya: hidaya,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});




//delete hidayaa
router.delete('/surahs/:dataId/hidayas/:hidayaId', async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const hidayaId = req.params.hidayaId;

    // Find the Surah by surahName in the data from data.json
    const surah = await DataJson.findById(dataId);

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    const hidaya = await Hidayaa.findById(hidayaId);
    if (hidaya.audio_public_id) {
      await cloudinary.uploader.destroy(hidaya.audio_public_id);
    }

    // Remove the Hidayaa record from the database
    await hidaya.deleteOne();

    res.status(200).json({
      success: true,
      msg: 'Hidayaa deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});



//all surah,ayah, and hidayaa
router.get('/surahs/hidayas/:dataId', async (req, res) => {

  try {
    const dataId = req.params.dataId;
    const surah = await DataJson.findOne({ _id: req.params.dataId });

    const allHidayaa = await Hidayaa.find({ dataId: dataId })

    if (!allHidayaa) {
      return res.status(400).json({ success: false, msg: `No Data is present. Please add Data` })
    }
    const note = await Note.findOne({noteText : Note.text})

    let isFavourite = false; // Initialize the isFavourite flag to false

    const favouriteCount = await Favourite.countDocuments();
    if (favouriteCount > 0) {
      isFavourite = true; // Set the flag to true if there is data in the Favourite collection
    }

    return res.status(200).json({ success: true, msg: ` All Surah, Hidayaa and ayah `,
     surahName: surah.transliteration, data: allHidayaa ,  noteText : note ? note.text : '',
    isFavourite :isFavourite });

  } catch (error) {
    console.log('Error occurred:', error);
    return res.status(500).json({ success: false, msg: `Server Error` });
  }
})


//getById
router.get('/surahs/:dataId/hidayas/:hidayaId', async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const hidayaId = req.params.hidayaId;

    const surah = await DataJson.findById(dataId).exec();

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }
    const file = req.file;

    // Find the hidaya by hidayaId in the Hidayaa model
    const hidaya = await Hidayaa.findById(hidayaId)

    if (!hidaya) {
      return res.status(404).json({ success: false, msg: 'Hidaya not found' });
    }
    //     // Find the Surah by surahName in the data from data.json
    //     const surah = data.find((item) => item.transliteration === surahName);
    //     const surahId = surah ? surah.id : null;

    //     if (!surah) {
    //       return res.status(404).json({ success: false, msg: 'Surah not found' });
    //     }

    //     const hidayaa = await Hidayaa.findById(hidayaId);

    //     if (!hidayaa) {
    //       return res.status(404).json({ success: false, msg: 'Hidayaa not found' });
    //     }

    //     // Check if surahName and ayahNumber match the hidayaId
    //     if (hidayaa.surahName !== surahName || hidayaa.ayahNumber !== ayahNumber) {
    //       return res.status(400).json({ success: false, msg: 'Surah and Ayah do not match the provided Hidayaa' });
    //     }

    return res.status(200).json({ success: true, msg: 'Surah, Hidayaa, and Ayah', data: { hidaya } });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, msg: 'Server Error' });
  }
});




module.exports = router;