


const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connectDB = async()=>{
    try{

        const connection = await mongoose.connect(process.env.MONOG_DB_URL, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        console.log(`DB is Connected :)`);
    } catch(error){
        console.log(error);
    }
}

module.exports = connectDB ;



