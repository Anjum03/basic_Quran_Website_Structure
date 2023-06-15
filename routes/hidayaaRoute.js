

require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const DataJson = require('../model/dataModel');
const multer = require('multer');

const storage = multer.memoryStorage(); //Store files in memory instead of saving them to disk
const upload = multer ({
  storage : storage 
});

//get all surah list
// GET request to retrieve surah data including hidayas
/* The above code is a route handler for a GET request to retrieve a list of Surahs from a database and
their associated Hidayas. It first retrieves the Surahs from the database and then uses the Surah
names to find the associated Hidayas. It then returns a response with the Surah details including
the Surah ID, name, number of associated Hidayas, and an array of the associated Hidayas. */
router.get('/all/surahList', async (req, res) => {
  try {

    // Find the Surah by dataId in the data from data.json
    const surahs = await DataJson.find({}, { _id: 1, transliteration: 1, });

    if (!surahs) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    const responseData = await Promise.all(
      surahs.map(async (surah)=>{
        const hidayas = await Hidayaa.find({
          dataId : surah._id});
          return{
            dataId : surah._id,
            surahName : surah.transliteration,
            hidayaCount : hidayas.length , 
            hidayas : hidayas.map((hidaya) => hidaya)
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

router.post('/surahs/:dataId/hidayas', upload.single('hidayaaAudio'), async (req, res) => {
  
  const { ayahNumber, ayahWord, hidayaText } = req.body;
  

  const file = req.file;

  try {
    const dataId = req.params.dataId;

    // Find the Surah by dataId in the data from data.json
    const surah = await DataJson.findById(dataId).exec();

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }
// 

    // Create a new hidaya using the Hidayaa model
    const newHidaya = await Hidayaa.create({
      dataId:dataId,
      surahName: surah.transliteration,
      ayahNumber,
      ayahWord,
      hidayaText,
      hidayaaAudio:file.originalname, 
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
router.put('/surahs/:dataId/hidayas/:hidayaId',upload.single('hidayaaAudio'), async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const hidayaId = req.params.hidayaId;
    const { ayahNumber, ayahWord, hidayaText } = req.body;

    // Find the Surah by surahName in the data from data.json
    const surah = await DataJson.findById(dataId).exec();

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }
    const file = req.file;

    // Find the hidaya by hidayaId in the Hidayaa model
    const hidaya = await Hidayaa.findByIdAndUpdate(hidayaId, {
      $set:{
        ayahNumber : ayahNumber ,
        ayahWord : ayahWord , 
        hidayaText : hidayaText,
        hidayaaAudio: file.originalname, 
      }
    }, {new : true});
    
    if (!hidaya) {
      return res.status(404).json({ success: false, msg: 'Hidaya not found' });
    }
    
    hidaya.surahName = surah.transliteration;

    // Save the updated hidaya
    const updatedHidaya = await hidaya.save();

    res.status(200).json({
      success: true,
      msg: 'Hidaya is updated',
      hidaya: updatedHidaya,
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

    // Find and delete the hidaya by hidayaId
    const deletedHidaya = await Hidayaa.findByIdAndDelete(hidayaId);

    if (!deletedHidaya) {
      return res.status(404).json({ success: false, msg: 'Hidaya not found' });
    }

    res.status(200).json({
      success: true,
      msg: 'Hidaya is deleted',
      hidaya: deletedHidaya,
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

    // Find the Surah by surahName in the data from data.json
    // const surah = await Hidayaa.findOne({dataId : dataId});

    // if (!surah) {
    //   return res.status(404).json({ success: false, msg: 'Surah not found' });
    // }
    const allHidayaa = await Hidayaa.findOne({ dataId : dataId})

    if (allHidayaa.length === 0) {
      return res.status(400).json({ success: false, msg: `No Data is present. Please add Data` })
    }
    return res.status(200).json({ success: true, msg: ` All Surah, Hidayaa and ayah `, data: allHidayaa });

  } catch (error) {
    console.log('Error occurred:', error);
    return res.status(500).json({ success: false, msg: `Server Error` });
  }

})


//getById
// router.get('/surahs/:surahName/hidayas/:hidayaId', async (req, res) => {
//   try {
//     const surahName = req.params.surahName;
//     const ayahNumber = req.query.ayahNumber; // Retrieve ayahNumber from query parameter
//     const hidayaId = req.params.hidayaId;

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

//     return res.status(200).json({ success: true, msg: 'Surah, Hidayaa, and Ayah', data: { surahId, hidayaa } });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ success: false, msg: 'Server Error' });
//   }
// });



module.exports = router;