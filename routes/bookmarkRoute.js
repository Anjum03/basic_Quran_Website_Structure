

const router = require('express').Router();
const Hidayaa = require('../model/hidayaModel');
const data = require('../data.json');

//add new bookmark id = ayahId
router.post('/surah/:surahName/:ayahNumber/bookmark', async(req,res)=>{

    try{

        const surahName = req.params.surahName ;
        const ayahNumber = req.params.ayahNumber ;
        const { bookmark} = req.body ;
    
        const surah = data.find((item) => item.transliteration === surahName);
        if(!surah){
            return res.status(400).json({ success : false , msg: `Surah Not Found`})
        }
    
        const ayahNum = data.find((item) => item.total_verses === ayahNumber);
        if(!ayahNum){
            return res.status(400).json({ success : false , msg: `AyahNUm Not Found`})
        }
    
        const newBookmark = await Hidayaa.create({
            surahName,
            ayah: [
              {
                ayahNumber,
              },
            ],
              bookmark : bookmark
        })
        res.status(200).json({
            success: true,
            msg: 'New Bookmark is created',
            newBookmark,
          });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, msg: 'Server Error' });
          }
});


module.exports = router ;