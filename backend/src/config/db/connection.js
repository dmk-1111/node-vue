const mongoose = require('mongoose');
require('dotenv').config();
const dbURI = process.env.MONGO_CONN;
const port = process.env.PORT || 8080;

const db = (app) =>{
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
      .then((result) => app.listen(port, (err) => {
        if(err){
          console.log('Error connection : ' + err);
        }
        console.log('Success connection db...\nServer running on port: http://localhost:' + port);
      }))
      .catch((err) => console.log(err));
}

module.exports = db;
