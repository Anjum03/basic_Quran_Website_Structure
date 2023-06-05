

require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const DataJson = require('../model/dataModel');

//get all surah list
// GET request to retrieve surah data including hidayas
/* The above code is a route handler for a GET request to retrieve a list of Surahs from a database and
their associated Hidayas. It first retrieves the Surahs from the database and then uses the Surah
names to find the associated Hidayas. It then returns a response with the Surah details including
the Surah ID, name, number of associated Hidayas, and an array of the associated Hidayas. */
router.get('/all/surahList', async (req, res) => {
  try {

    // Find the Surah by dataId in the data from data.json
    const surahs = await DataJson.find({},{ _id: 1, transliteration: 1  , });

    if (!surahs) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    const hidayas = await Promise.all(
      surahs.map(async (surah) => {
        const hidayas = await Hidayaa.find({ surahName: surah.transliteration });
        return hidayas;
      })
    );
    // Find hidayas associated with the surah
    const responseData = surahs.map((surah, index) => {
      return {
        _id: surah._id,
        surahName: surah.transliteration,
        hidayasCount: hidayas[index].length,
        hidayas: hidayas[index].map((hidaya) => hidayas[index]),
      };
    });
    
    res.status(200).json({ success: true, msg: 'Surah Details', surahData:responseData, });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});

// router.get('/all/surahList', async (req, res) => {
//   try {
//     // Find all surahs from the DataJson collection
//     const surahs = await DataJson.find({}, { _id: 1, transliteration: 1 });

//     if (!surahs) {
//       return res.status(404).json({ success: false, msg: 'Surah not found' });
//     }

//     const ayahs = await Promise.all(
//       surahs.map(async (surah) => {
//         const ayahs = await QuranAudio.find({ surahName: surah.transliteration });
//         return ayahs;
//       })
//     );

//     // Create the response data with surah details and their associated ayahs
//     const surahData = surahs.map((surah, index) => {
//       return {
//         _id: surah._id,
//         surahName: surah.transliteration,
//         ayahCount: ayahs[index].length,
//         ayahs: ayahs[index],
//       };
//     });

//     res.status(200).json({ success: true, msg: 'SurahList with Ayah', hidayaData: surahData });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, msg: 'Server Error' });
//   }
// });




// Add new hidaya to a specific surah
router.post('/surahs/:dataId/hidayas', async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const { ayahNumber, ayahDetails } = req.body;

    // Find the Surah by dataId in the data from data.json
    const surah = await DataJson.findById(dataId).exec();

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    // Create a new hidaya using the Hidayaa model
    const newHidaya = await Hidayaa.create({
      surahName: surah.transliteration,
      ayah: [
        {
          ayahNumber: ayahNumber,
          ayahDetails: ayahDetails,
        },
      ],
    });

    res.status(200).json({
      success: true,
      msg: 'New hidaya is created',
      dataId: dataId,
      // surahName: surah.transliteration,
      newHidaya: newHidaya,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});



  
//update hidaya
router.put('/surahs/:dataId/hidayas/:hidayaId', async (req, res) => {
  try {
    const dataId = req.params.dataId;
    const hidayaId = req.params.hidayaId;
    const { ayahNumber, ayahDetails } = req.body;

    // Find the Surah by surahName in the data from data.json
    const surah = await DataJson.findById(dataId).exec();

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    // Find the hidaya by hidayaId in the Hidayaa model
    const hidaya = await Hidayaa.findById(hidayaId);

    if (!hidaya) {
      return res.status(404).json({ success: false, msg: 'Hidaya not found' });
    }

    // Update the hidaya fields
    hidaya.surahName = surah.transliteration;
    hidaya.ayah[0].ayahNumber = parseInt(ayahNumber);
    hidaya.ayah[0].ayahDetails = ayahDetails;

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
    const dataId = req.params.dataId ; 

     // Find the Surah by surahName in the data from data.json
     const surah = await DataJson.findById(dataId);
  
     if (!surah) {
       return res.status(404).json({ success: false, msg: 'Surah not found' });
     }
      const allHidayaa = await Hidayaa.find({surahName:surah.transliteration})

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