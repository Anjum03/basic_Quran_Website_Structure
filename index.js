
require('dotenv').config();
const app = require('express')();
const PORT = process.env.PORT || 3001 ;



//DB connection
const connectDB = require("./middleware/dbConnections");
connectDB();


//using cors
const cors = require('cors');
app.use(cors());

//using bodyPareser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//using morgan
const morgan = require('morgan');
app.use(morgan('combined'));

const fileUpload = require('express-fileupload');
app.use(fileUpload({
    useTempFiles: true,
}))

//routing

const loginRoute = require("./routes/loginRoute");
app.use('/', loginRoute);

const hidayaaRoute = require("./routes/hidayaaRoute");
app.use('/', hidayaaRoute);

const QuranAudioRoute = require("./routes/QuranAudioRoute");
app.use('/', QuranAudioRoute);

const BookmarkRoute = require("./routes/bookmarkRoute");
app.use('/', BookmarkRoute);

const DeviceTokenRoute = require("./routes/deviceTokenRoute");
app.use('/', DeviceTokenRoute);

const DataJsonRoute = require("./routes/dataJsonRoute");
app.use('/', DataJsonRoute);

const NoteRoute = require("./routes/addNoteRoute");
app.use('/', NoteRoute);

const FavouriteRoute = require("./routes/favouriteRoute");
app.use('/', FavouriteRoute);

const imgHidayaaRoute = require("./routes/imgHidayaaRoute");
app.use('/', imgHidayaaRoute);

app.listen(PORT,()=>{
    console.log(`Server is Started on PORT ${PORT}`)
})

