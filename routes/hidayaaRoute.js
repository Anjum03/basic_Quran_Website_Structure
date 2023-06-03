

require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const DataJson = require('../model/dataModel');
const data = require('../data.json')

//get all surah list
//publish part is remaining
// router.get('/all/surahList', async(req, res)=>{

//   const surahs = DataJson.map( (item) =>{
//     return {
//       _id : item._id,
//       surahName : item.transliteration,
//       hidayasCount : 0 ,

//     }
//   });
//   // for (const surah of surahs) {
//     //       const hidayas = await Hidayaa.find({ surahName: surah.surahName });
//     //       surah.hidayasCount = hidayas.length;
//     //       // surah.hidayas = hidayas.map((hidaya) => hidaya._id);
//     //     }
//         res.status(200).json({ success: true, msg: 'Surah Details', surahData: surahs });
    

// });

router.get('/all/surahList', async (req, res) => {
  try {
    const surahs = await DataJson.find({}, { _id: 1, transliteration: 1  , });
    for (const surah of surahs) {
      const hidayas = await Hidayaa.find({ surahName: surah.transliteration });
      surah.hidayasCount = hidayas.length;
      // surah.hidayas = hidayas.map((hidaya) => hidaya._id);
    }
    // const surahs =
      // DataJson.map((item) => {
      //   return {
      //     _id: item._id,
      //     surahName: item.transliteration,
      //     // hidayasCount: hidayas.length,
      //     hidayasCount: 0,
      //   };
      // })
    // );



res.status(200).json({ success: true, msg: 'Surah Details', surahData: surahs });

} catch (error) {
console.log(error);
res.status(500).json({ success: false, msg: 'Server Error' });
}
});
; // Import your Mongoose model

// router.get('/all/surahList', async (req, res) => {
//   try {
//     const surahs = await YourModel.find({}, { _id: 1, transliteration: 1 });

//     for (const surah of surahs) {
//       const hidayas = await Hidayaa.find({ surahName: surah.transliteration });
//       surah.hidayasCount = hidayas.length;
//       // surah.hidayas = hidayas.map((hidaya) => hidaya._id);
//     }

//     res.status(200).json({ success: true, msg: 'Surah Details', surahData: surahs });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, msg: 'Server Error' });
//   }
// });




// router.get('/all/surahList', async (rseq, res) => {
//   try {
  
//     const surahs = data.map((item) => {
//       return {
//         id: item.id,
//         surahName: item.transliteration,
//         hidayasCount: 0,
//         // hidayas: [] // Initialize the array
//       };
//     });

//     for (const surah of surahs) {
//       const hidayas = await Hidayaa.find({ surahName: surah.surahName });
//       surah.hidayasCount = hidayas.length;
//       // surah.hidayas = hidayas.map((hidaya) => hidaya._id);
//     }
//     res.status(200).json({ success: true, msg: 'Surah Details', surahData: surahs });

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
    const surah = DataJson.findById({dataId});

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    // Create a new hidaya using the Hidayaa model
    const newHidaya = await Hidayaa.create({
      surahName: surah.surahName,
      ayah: [
        {
          ayahNumber: ayahNumber,
          ayahDetails: ayahDetails,
        },
      ],
    });

    res.status(200).json({   success: true,msg: 'New hidaya is created', data : dataId ,  newHidaya,});
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
    const surah = await DataJson.findById(dataId);

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
// hidya/surahid



//all surah,ayah, and hidayaa
router.get('/surahs/hidayas/:dataId', async (req, res) => {

  try {
    const dataId = req.params.dataId ; 

     // Find the Surah by surahName in the data from data.json
     const surah = await DataJson.findById(dataId);
  
     if (!surah) {
       return res.status(404).json({ success: false, msg: 'Surah not found' });
     }
      const allHidayaa = await Hidayaa.find()

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