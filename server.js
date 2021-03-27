const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api')
const cors = require('cors')

const mongoose = require('mongoose');
const db = 'mongodb+srv://admin:nmumbolSULsA5GiN@cluster0.5j22e.mongodb.net/mytestapp?retryWrites=true&w=majority' 

mongoose.connect(db, (err) => {
    if(err) {
        console.error(err);
    } else {
        console.log('DB is Connected')
    }
})

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())

app.use(bodyParser.json())
app.use('/api', api);



app.get('/', function(req,res) {
    res.send('Hello from server')
})

app.listen(PORT, function() {
    console.log('Server is running on PORT: '+PORT);
})