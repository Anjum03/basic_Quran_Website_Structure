
require('dotenv').config();

const router = require('express').Router();
const ImgHidayaa = require('../model/imgHidayaaModel');
const DataJson = require('../model/dataModel');
// cloudinary

const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//create add new hidayaa with img 
router.post('/:surahId/addNewHidayaa', async (req, res) => {

    const surahId = req.params.surahId;
    const { ayahNumber, ayahWord, hidayaaText, } = req.body;

    try {

        const surah = await DataJson.findById(surahId);

        if (!surah) {
            res.status(404).json({ success: false, msg: `please provide correct SurahId` });
        }

        let hidayaaAudioFiles = [];
        let hidayaaImgFiles = [];

        //check audio is in array or not
        if (Array.isArray(req.files.hidayaaAudio)) {
            hidayaaAudioFiles = req.files.hidayaaAudio

        } else {
            hidayaaAudioFiles.push(req.files.hidayaaAudio)
        }

        //check fro img also it is array or single
        if (Array.isArray(req.files.hidayaaImg)) {
            hidayaaImgFiles = req.files.hidayaaImg

        } else {
            hidayaaImgFiles.push(req.files.hidayaaImg)
        }
        const hidayaaImgUrls = [];

        for (const file of hidayaaImgFiles) {
            const image = await cloudinary.uploader.upload(file.tempFilePath, {
                resource_type: 'img',
                format: 'jpg',
                resource_type: 'auto'
            });
            hidayaaImgUrls.push(image.secure_url);
        }
        const hidayaaAudioUrls = [];

        for (const file of hidayaaAudioFiles) {
            const audio = await cloudinary.uploader.upload(file.tempFilePath, {
                resource_type: 'video',
                format: 'mp3',
                resource_type: 'auto'
            });
            hidayaaAudioUrls.push(audio.secure_url);
        }


        const addNewHidayaa = await ImgHidayaa.create({

            surahId: surahId,
            surahName: surah.transliteration,
            ayahNumber,
            ayahWord,
            hidayaaText,
            hidayaaImg: hidayaaImgUrls,
            hidayaaAudio: hidayaaAudioUrls

        })

        res.status(200).json({ success: true, msg: `Hidayaa Add Successfully ... :)`, data: addNewHidayaa })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Backend Server Error` + error })
    }

});



// Helper function to extract the public ID from a Cloudinary URL
function getPublicIdFromUrl(url) {
    const publicId = url.split('/').pop().split('.')[0];
    return publicId;
  }
  //update 
router.put('/:surahId/addNewHidayaa/:addNewHIdayaaId', async (req, res) => {

    const { surahId, addNewHIdayaaId } = req.params
    const { ayahNumber, ayahWord, hidayaaText, } = req.body;
    try {

        const surah = await DataJson.findById(surahId);

        if (!surah) {
            res.status(404).json({ success: false, msg: `please provide correct SurahId` });
        }

        const addNewHIdayaa = await ImgHidayaa.findById(addNewHIdayaaId,
            //      {
            //     $set: 
            // }, { new: true },
        );

        if (!addNewHIdayaa) {
            res.status(404).json({ success: false, msg: `please provide correct addNewHidayaaId` });
        }

        const updateAddNewHidayaaWithImg = {
            surahId: surahId,
            surahName: surah.transliteration,
            ayahNumber: ayahNumber,
            ayahWord: ayahWord,
            hidayaaText: hidayaaText,
            hidayaaImg: addNewHIdayaa.hidayaaImg,
            hidayaaAudio: addNewHIdayaa.hidayaaAudio
        }
        //cloudianry effect
        //in this first we delete existing img and audio and then create new 
        //delete first 
        for (const url of addNewHIdayaa.hidayaaImg) {
            await cloudinary.uploader.destroy(getPublicIdFromUrl(url));
        }
        for (const url of addNewHIdayaa.hidayaaAudio) {
            await cloudinary.uploader.destroy(getPublicIdFromUrl(url));
        }
//now create

if(Array.isArray(req.files.hidayaaImg)){
    const hidayaaImgFiles = req.files.hidayaaImg ;
    for(const file of hidayaaImgFiles){
        const image = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'image',
              format: 'jpg',
              resource_type: 'auto'
        });

        updateAddNewHidayaaWithImg.hidayaaImg.push(image.secure_url);
    }
}

if(Array.isArray(req.files.hidayaaAudio)){
    const hidayaaAudioFiles = req.files.hidayaaAudio ;
    for(const file of hidayaaAudioFiles){
        const audio = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: 'video',
              format: 'mp3',
              resource_type: 'auto'
        });

        updateAddNewHidayaaWithImg.hidayaaAudio.push(audio.secure_url);
    }
}

const updatedHidyaaWithImg = await ImgHidayaa.findByIdAndUpdate( addNewHIdayaaId, 
updateAddNewHidayaaWithImg ,{new : true})
res.status(200).json({ success: true, msg: `Hidayaa with Img updated successfully`, data: updatedHidyaaWithImg });

        // res.status(404).json({ success: true, msg: `Update addNewHidayaa`, data: updatedHidyaaWithImg })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Backend Server Error` + error })
    }

});


//delete add new hidayaa surahId and addNewHidayaaId

router.delete('/:surahId/addNewHidayaa/:addNewHidayaaId', async (req, res) => {
    const { surahId, addNewHidayaaId } = req.params;
    try {
      const surah = await DataJson.findById(surahId);
      if (!surah) {
        return res.status(404).json({ success: false, msg: `please provide correct SurahId` });
      }
  
      const addNewHidayaa = await ImgHidayaa.findByIdAndDelete(addNewHidayaaId);
      if (!addNewHidayaa) {
        return res.status(404).json({ success: false, msg: `please provide correct addNewHidayaaId` });
      }
  
      for (const url of addNewHidayaa.hidayaaImg) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(url));
      }
      for (const url of addNewHidayaa.hidayaaAudio) {
        await cloudinary.uploader.destroy(getPublicIdFromUrl(url));
      }
  
      res.status(200).json({ success: true, msg: `Hidayaa with Img delete successfully`, data: addNewHidayaa });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: `Backend Server Error: ${error}` });
    }
  });
  








//get ALL add new hidayaa with surahId 
router.get('/:surahId/addNewHidayaa', async (req, res) => {

    const surahId = req.params.surahId;

    try {

        const surah = await DataJson.findById(surahId);

        if (!surah) {
            res.status(404).json({ success: false, msg: `please provide correct SurahId` });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Backend Server Error` + error })
    }

});




//getById add new hidayaa with surahId and addNewHIdayaaId
router.get('/:surahId/addNewHidayaa/:addNewHidayaaId', async (req, res) => {

    const surahId = req.params.surahId;

    try {

        const surah = await DataJson.findById(surahId);

        if (!surah) {
            res.status(404).json({ success: false, msg: `please provide correct SurahId` });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: `Backend Server Error` + error })
    }

});


module.exports = router;
