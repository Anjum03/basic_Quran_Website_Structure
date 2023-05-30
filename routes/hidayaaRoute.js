

require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const data = require('../data.json');

//get all surah list
//publish part is remaining

router.get('/all/surahList', async (req, res) => {
  try {
    const surahs = await Promise.all(
        data.map(async (item) => {
          const hidayasCount = await Hidayaa.countDocuments({ surahName: item.transliteration });
          return {
            surahName: item.transliteration,
            hidayasCount,
          };
        })
      );
    res.status(200).json({ success: true, msg: 'SurahList', hidayaData: surahs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});

module.exports = router;


// router.post('/hidayas', async (req, res) => {

//     try {

//         const { surahName, hidayaaNumber, ayah } = req.body;
//         const hidayaData = await Hidayaa.create({ //list page render
//             surahName, //it comes from surahList 
//             hidayaaNumber, //  particular surah m jitne hidaya present honge
//             ayah: ayah ||  [], //ayah comest from ayah List
//         });

//         if(surahName && hidayaaNumber){
//             hidayaaResponse = `Surah Name and Hidayaa Number is added `
//         }  else if(surahName  ){
//             hidayaaResponse =   `Surah Name is added `;
//         } else if(hidayaaNumber){
//             hidayaaResponse =  `Hidayaa Number is added `;
//         } else if(ayah){
//             hidayaaResponse =  `Ayah is added `;
//         } else{
//             hidayaaResponse = `Surah Name, Hidayaa Number and Ayah is added `
//         }

//         res.status(200).json({ success: true, msg: hidayaaResponse, data: hidayaData })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, msg: `Server Error ` })
//     }


// });

// Add new hidaya to a specific surah

// Add new hidaya to a specific surah
router.post('/surahs/:surahName/hidayas', async (req, res) => {
  try {
    const surahName = req.params.surahName;
    const { ayahNumber, ayahDetails } = req.body;

    // Find the Surah by surahName in the data from data.json
    const surah = data.find((item) => item.transliteration === surahName);

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    // Create a new hidaya using the Hidayaa model
    const newHidaya = await Hidayaa.create({
      surahName,
      ayah: [
        {
          ayahNumber : ayahNumber,
          ayahDetails: ayahDetails 
        },
      ],
    });

    res.status(200).json({
      success: true,
      msg: 'New hidaya is created',
      newHidaya,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});


  
  
  
  
//update hidaya
router.put('/surahs/:surahName/hidayas/:hidayaId', async (req, res) => {
  try {
    const surahName = req.params.surahName;
    const hidayaId = req.params.hidayaId;
    const { ayahNumber, ayahDetails } = req.body;

    // Find the Surah by surahName in the data from data.json
    const surah = data.find((item) => item.transliteration === surahName);

    if (!surah) {
      return res.status(404).json({ success: false, msg: 'Surah not found' });
    }

    // Find the hidaya by hidayaId in the Hidayaa model
    const hidaya = await Hidayaa.findById(hidayaId);

    if (!hidaya) {
      return res.status(404).json({ success: false, msg: 'Hidaya not found' });
    }

    // Update the hidaya fields
    hidaya.surahName = surahName;
    hidaya.ayah[0].ayahNumber = ayahNumber;
    hidaya.ayah[0].ayahDetails = ayahDetails

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
router.delete('/surahs/:surahName/hidayas/:hidayaId', async (req, res) => {
    try {
      const surahName = req.params.surahName;
      const hidayaId = req.params.hidayaId;
  
      // Find the Surah by surahName in the data from data.json
      const surah = data.find((item) => item.transliteration === surahName);
  
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
router.get('/', async (req, res) => {

    try {
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
router.get('/surahs/:surahName/hidayas/:hidayaId', async (req, res) => {
    try {
      const surahName = req.params.surahName;
      const hidayaId = req.params.hidayaId;
  
      // Find the Surah by surahName in the data from data.json
      const surah = data.find((item) => item.transliteration === surahName);
  
      if (!surah) {
        return res.status(404).json({ success: false, msg: 'Surah not found' });
      }
        const hidayaa = await Hidayaa.findById(hidayaId);
        return res.status(200).json({ success: true, msg: ` All Surah, Hidayaa and ayah `, data: hidayaa });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }

})

module.exports = router;