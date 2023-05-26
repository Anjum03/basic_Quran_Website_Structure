

require('dotenv').config();
const router = require('express').Router();
const QuranAudio = require('../model/QuranAudioModel');
const data = require('../data.json');
const QuranAudioModel = require('../model/QuranAudioModel');

// to get all surahName and Ayat No  // first Page

      router.get('/QuranAudio/Dummy', async(req,res)=>{

        try{
    
            const dummyData = await QuranAudio.insertMany(data);

             // Extract only the required data (surahName and Ayat No) from allQuranAudio
    // const extractedData = dummyData.map(item => {
    //     return {
    //     //   surahName: item.surahName,
    //     //   totalAyah: item.totalAyah,
    //       text: item.text,
    //       audio: item.audio
    //     };
    //   });
            
            return res.status(200).json({ success: true, msg: ` All Surah list  `, data: dummyData });
    
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, msg: `Server Error ` })
        }
    
    });

router.get('/QuranAudio/AllData', async(req,res)=>{

    try{

        const allQuranAudio = await QuranAudio.find()

        if(allQuranAudio.length === 0){
            //i use dummy data but change when xls file comes
            // allQuranAudio = await QuranAudio.find()

            return res.status(400).json({ success:  false, msg: ` No Quran Audio list  `,});
        }
        const extractedData = allQuranAudio.map(item => {
            return {
            //   surahName: item.surahName,
            //   totalAyah: item.totalAyah,
              text: item.text,
              audio: item.audio
            };
          });
        
        return res.status(200).json({ success: true, msg: ` All Surah list  `, data: extractedData});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Server Error ` })
    }

});


//getById
router.get('/QuranAudio/AllData/:id', async(req,res)=>{

    try{

        const oneQuranAudio = await QuranAudio.findById(req.params.id) || await QuranAudio.insertMany(data)
        if(!oneQuranAudio){
           await QuranAudio.insertMany(data)
      // Extract only the required data (surahName and Ayat No) from allQuranAudio
    const extractedData = dummyData.map(item => {
        return {
        //   surahName: item.surahName,
        //   totalAyah: item.totalAyah,
          text: item.text,
          audio: item.audio
        };
      });

            return res.status(400).json({ success:  false, msg: ` No Quran Audio list  `, data:  extractedData});
        }
        return res.status(200).json({ success: true, msg: ` All Surah, Hidayaa and ayah `, data: oneQuranAudio});

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
router.post('/QuranAudio', async(req,res)=>{
    // const {text, audio, surahName, totalAyah} = req.body ;
    const { text, audio} = req.body ;
    try{
        
        const surahList = await QuranAudio.create({ text, audio,});
        // const surahList = await QuranAudio.create({ text, audio, surahName, totalAyah, });
        return res.status(200).json({ success: true, msg: `Surah list created `, data: surahList});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }

});



//update QuranAudio
router.put('/audio/:id', async(req,res)=>{

    const { id} = req.params ;
    const {text, audio,} = req.body ;

    try{

        // const audioData = await QuranAudio.findById(id)
        // if(!audioData  ){
        //     return res.status(400).json({ success: false, msg:  ` Audio Not Found`  })
        // }
        const  audioData = await QuranAudio.findByIdAndUpdate(id, {
            $set:{
                text:text,
                audio:audio
            }
        }, {new:true}
        ) ;
         if(!audioData  ){
                return res.status(400).json({ success: false, msg:  ` Audio Not Found`  })
            }

        // const audioUpdated = await  audioData .save() ;

        return res.status(200).json({ success: true, msg: ` Surah list  Updated  `, data:  audioData});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }

});



//delete QuranAudio
router.delete('/audio/:id', async(req,res)=>{
    try{
     
        const audioId = await QuranAudioModel.findByIdAndDelete(req.params.id)
        if(!audioId){
            return res.status(400).json({ success: false, msg:  ` Audio Not Found`  })
        }
        res.status(200).json({ success : true ,  msg: `Audio Deleted`,data: audioId})
   } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }


})

module.exports = router ;