const mongoose=require('mongoose');

//Uri of mongodb
const mongoURI="mongodb+srv://mintdropz:mintdropz123@mintdropz.h3cz1.mongodb.net/mintDopz?retryWrites=true&w=majority"

const connectToMongo =()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connect to MongoDb");
    })
}

module.exports=connectToMongo;

