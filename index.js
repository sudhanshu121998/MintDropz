const connectToMongo=require('./db');
const express = require('express')
//Creating Express App
const app = express()
const port = 5000


//Connecting to MongoDb
connectToMongo();

//Middleware to parse the body content(we can use req.body now to get body of req)
app.use(express.json());


//Available Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/posts',require('./routes/posts'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
