require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 9090;
mongoose.connect(process.env.MONGO_URI, 
  { useNewUrlParser: true, 
    useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const Record = mongoose.model('Record', {
  
   name : String,
   start_time : String,
   end_time : String,
   hours_worked : String,
   rate_per_hours : String,
   PO_Number : String,
   Supplier: String,  


});



app.get('/', async (req, res) => {
  
  try {
     
    const Supplier = await Record.find({}, 'Supplier').exec();
    
    const data = await Record.find().distinct('PO Number').exec();

    res.render('form', { data , Supplier });

  } catch (err) {
    console.error(err);
  }
  
 

});

app.get('/save', async (req, res) => {
  try {
    res.render('save');
  } catch (err) {
    console.error(err);
  }
})


app.post('/saveData', async (req, res) => {
  const {  name ,
    start_time ,
    end_time ,
    hours_worked ,
    rate_per_hours ,
    PO_Number ,
    Supplier,  } = req.body;
  const record = new Record({  name ,
    start_time ,
    end_time ,
    hours_worked ,
    rate_per_hours ,
    PO_Number ,
    Supplier,   });
  try {
    await record.save();
     console.log("dsave");
    res.redirect('/save');
    res.render('save');
  } catch (err) {
    console.error(err);
  }
});




app.get('/display', async (req, res) => {
  const { nameFilter, supplierFilter,ponFilter} = req.query; 

  let query = {}; 
  if (nameFilter) {
    query.name = nameFilter; 
  }
  if (supplierFilter) {
    query.Supplier = supplierFilter; 
  }
  if (ponFilter) {
    query.PO_Number = ponFilter; 
  }

  try {
    const records = await Record.find(query).exec(); 
    res.render('display', { records, nameFilter, supplierFilter , ponFilter }); 
  } catch (err) {
    console.error(err);
  }
});



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
