

require('dotenv').config();
const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');



router.post('/hidayas', async (req, res) => {

    try {

        const { surahName, hidayaaNumber, ayah } = req.body;
        const hidayaData = await Hidayaa.create({
            surahName,
            hidayaaNumber,
            ayah: ayah ||  [],
        });
   
        if(surahName && hidayaaNumber){
            hidayaaResponse = `Surah Name and Hidayaa Number is added `
        }  else if(surahName  ){
            hidayaaResponse =   `Surah Name is added `;
        } else if(hidayaaNumber){
            hidayaaResponse =  `Hidayaa Number is added `;
        } else if(ayah){
            hidayaaResponse =  `Ayah is added `;
        } else{
            hidayaaResponse = `Surah Name, Hidayaa Number and Ayah is added `
        }

        res.status(200).json({ success: true, msg: hidayaaResponse, data: hidayaData })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Server Error ` })
    }


});


//update hidaya
router.put('/hidayas/:id', async (req,res) => {
    try{

        const hidayaId = req.params.id ;
        const{ surahName, hidayaaNumber, ayah } = req.body ;
        const hidayaa = await Hidayaa.findByIdAndUpdate(hidayaId, {
            $set: {
                surahName : surahName, 
                hidayaaNumber : hidayaaNumber, 
                ayah : ayah ,
            },
        },
         {new:true});
        if(!hidayaa){
            res.status(400).json({ success: false, msg: `Hidaya Not Found`})
        }
    
        res.status(200).json({ success: true, msg: `Update Hidaya`, data: hidayaa});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Server Error ` })
    }


});

  

//delete hidayaa
router.delete('/hidayas/:id', async (req,res) => {
    try{

        const hidayaId = req.params.id ;
        const hidayaa = await Hidayaa.findByIdAndDelete(hidayaId)
        if(!hidayaa){
            return res.status(400).json({ success: false, msg: `Hidaya Not Found`})
        }
    
        return res.status(200).json({ success: true, msg: ` Hidaya Deleted `, data: hidayaa});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }


});

module.exports = router;