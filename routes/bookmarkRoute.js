const router = require('express').Router();
const Bookmark = require('../model/bookmarkModel');
const Hidayaa = require('../model/hidayaModel');

// Create a new bookmark
router.post('/surahs/:surahName/:ayahNumber/bookmark', async (req, res) => {
  const surahName = req.params.surahName;
  const ayahNumber = parseInt(req.params.ayahNumber);
  const { bookmark } = req.body;
console.log(`surahName , ayahNumber : `, surahName , ayahNumber)
  try {
    // Find the Hidayaa document corresponding to the surah name and ayah number
    // const hidayaa = await Hidayaa.findOne({ surahName, ayahNumber });
    const hidayaa = await Hidayaa.findOne({
        surahName: { $regex: new RegExp(surahName, 'i') },
        ayahNumber,
      });
      console.log(`Hidayaa: `, hidayaa);
  
      if (!hidayaa) {
        return res.status(404).json({ error: 'Hidayaa not found' });
      }

    // Create a new bookmark and save it
    const newBookmark = new Bookmark({
      surahName: hidayaa.surahName,
      ayahNumber: hidayaa.ayahNumber,
      hidaya: hidayaa._id,
      bookmark,
    });

    await newBookmark.save();

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




  
  

// //update bookmark 
// router.put('/surahs/:surahName/:ayahNumber/bookmark/:bookmarkId', async (req, res) => {
//     try {
//         const surahName = req.params.surahName;
//         // const ayahDetailsId = req.params.ayahDetailsId;
//         const ayahNumber = parseInt(req.params.ayahNumber);
//         const bookmarkId = req.params.bookmarkId;
//         const { bookmark } = req.body;

//         const surah = data.find((item) => item.transliteration === surahName);
//         if (!surah) {
//             return res.status(400).json({ success: false, msg: 'Surah Not Found' });
//         }

//         const verse = data.find((item) => item.total_verses === ayahNumber);
//         if (!verse) {
//             return res.status(400).json({ success: false, msg: 'Ayah Number Not Found' });
//         }

//         const bookmarkData = await Hidayaa.findById(bookmarkId);

//         if (!bookmarkData) {
//             return res.status(404).json({ success: false, msg: 'bookmarkData not found' });
//         }
//         // if (!ayahDetailsId) {
//         //     return res.status(404).json({ success: false, msg: 'ayahDetailsId not found' });
//         // }

//         //update
//         bookmarkData.surahName = surahName;
//         bookmarkData.ayahNumber = ayahNumber;
//         // bookmarkData.ayahDetails = ayahDetailsId
//         bookmarkData.bookmark = bookmark

//         const bookmarkDataUpdated = await bookmarkData.save();

//         res.status(200).json({ success: true, msg: 'New Bookmark is created', bookmarkDataUpdated, });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, msg: 'Server Error' });
//     }
// });



// //delete bbokmark
// router.delete('/surahs/:surahName/:ayahNumber/bookmark/:bookmarkId', async (req, res) => {
//     try {
//         const surahName = req.params.surahName;
//         const ayahNumber = parseInt(req.params.ayahNumber);
//         const bookmarkId = req.params.bookmarkId;

//         const surah = data.find((item) => item.transliteration === surahName);
//         if (!surah) {
//             return res.status(400).json({ success: false, msg: 'Surah Not Found' });
//         }

//         const verse = data.find((item) => item.total_verses === ayahNumber);
//         if (!verse) {
//             return res.status(400).json({ success: false, msg: 'Ayah Number Not Found' });
//         }

//         const bookmarkData = await Hidayaa.findByIdAndDelete(bookmarkId);

//         if (!bookmarkData) {
//             return res.status(404).json({ success: false, msg: 'bookmarkData not found' });
//         }


//         // const bookmarkDataUpdated = await bookmarkData.save();

//         res.status(200).json({ success: true, msg: 'New Bookmark is created', bookmarkData, });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, msg: 'Server Error' });
//     }
// });




// //get all bookamrk
// router.get('/surahs/:surahName/:ayahNumber/bookmark', async (req, res) => {
//     try {
//         const surahName = req.params.surahName;
//         const ayahNumber = parseInt(req.params.ayahNumber);
        

//         const surah = data.find((item) => item.transliteration === surahName);
//         if (!surah) {
//             return res.status(400).json({ success: false, msg: 'Surah Not Found' });
//         }

//         const verse = data.find((item) => item.total_verses === ayahNumber);
//         if (!verse) {
//             return res.status(400).json({ success: false, msg: 'Ayah Number Not Found' });
//         }

//         const bookmarkData = await Hidayaa.find();

//         if (!bookmarkData) {
//             return res.status(404).json({ success: false, msg: 'bookmarkData not found' });
//         }


//         res.status(200).json({ success: true, msg: 'New Bookmark is created', bookmarkData, });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, msg: 'Server Error' });
//     }
// });



// // one bookmark
// router.get('/surahs/:surahName/:ayahNumber/bookmark/:bookmarkId', async (req, res) => {
//     try {
//         const surahName = req.params.surahName;
//         const ayahNumber = parseInt(req.params.ayahNumber);
//         const bookmarkId = req.params.bookmarkId;
//         const { bookmark } = req.body;

//         const surah = data.find((item) => item.transliteration === surahName);
//         if (!surah) {
//             return res.status(400).json({ success: false, msg: 'Surah Not Found' });
//         }

//         const verse = data.find((item) => item.total_verses === ayahNumber);
//         if (!verse) {
//             return res.status(400).json({ success: false, msg: 'Ayah Number Not Found' });
//         }

//         const bookmarkData = await Hidayaa.findById(bookmarkId);

//         if (!bookmarkData) {
//             return res.status(404).json({ success: false, msg: 'bookmarkData not found' });
//         }


//         res.status(200).json({ success: true, msg: 'New Bookmark is created', bookmarkData, });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, msg: 'Server Error' });
//     }
// });


module.exports = router;