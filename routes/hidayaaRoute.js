

require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const data = require('../data.json');

//get all surah list
//publish part is remaining
router.get('/all/surahList', async(req,res)=>{

    try {
       
        const dummyData = await Hidayaa.insertMany(data);
    
        res.status(200).json({ success: true, msg: 'SurahList', hidayaData: dummyData });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: 'Server Error' });
      }

})


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

router.post('/hidayas', async (req, res) => {
    try {
      const { ayahNumber, ayahDetails } = req.body;
  
      const hidayaData = await Hidayaa.create({
        ayahNumber: ayahNumber,
        ayahDetails: ayahDetails,
      });
  
      res.status(200).json({ success: true, msg: 'New ayah is created', hidayaData: hidayaData });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: 'Server Error' });
    }
  });
  
  
  
//update hidaya
router.put('/hidayas/:id', async (req, res) => {
    try {

        const hidayaId = req.params.id;
        const { ayahNumber, ayahDetails } = req.body;
        const hidayaa = await Hidayaa.findByIdAndUpdate(hidayaId, {
            $set: {
                ayahNumber: ayahNumber, 
                ayahDetails:  ayahDetails
                // surahName : surahName, 
                // hidayaaNumber : hidayaaNumber, 
                // ayah : ayah ,
            },
        },
            { new: true });
        if (!hidayaa) {
            return res.status(400).json({ success: false, msg: `Hidaya Not Found` })
        }

        return res.status(200).json({ success: true, msg: `Update Hidaya`, data: hidayaa });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Server Error ` })
    }


});



//delete hidayaa
router.delete('/hidayas/:id', async (req, res) => {
    try {

        const hidayaId = req.params.id;
        const hidayaa = await Hidayaa.findByIdAndDelete(hidayaId)
        if (!hidayaa) {
            return res.status(400).json({ success: false, msg: `Hidaya Not Found` })
        }

        return res.status(200).json({ success: true, msg: ` Hidaya Deleted `, data: hidayaa });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
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
router.get('/all/:id', async (req, res) => {

    try {

        const hidayaa = await Hidayaa.findById(req.params.id);
        return res.status(200).json({ success: true, msg: ` All Surah, Hidayaa and ayah `, data: hidayaa });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }

})

module.exports = router;