
require('dotenv').config();
const app = require('express')();
const PORT = process.env.PORT || 3000 ;


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


//routing

const loginRoute = require("./routes/loginRoute");
app.use('/', loginRoute);

const hidayaaRoute = require("./routes/hidayaaRoute");
app.use('/', hidayaaRoute);


app.listen(PORT,()=>{
    console.log(`Server is Started on PORT ${PORT}`)
})

