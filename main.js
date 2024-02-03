const mongoose = require('mongoose');
const express=require('express');
const app = express();
const joi=require('joi');
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/wednesday', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
const userSchema = new mongoose.Schema({
   id: Number,
  name: String,
  age: Number,
  uid: String,
});

 const Userdetails =mongoose.model("Userdetails", userSchema);

 const usermarks = new mongoose.Schema({
  uid: mongoose.Types.ObjectId,
  grade: String
});

const Usermarks = mongoose.model("Usermarks", usermarks);

let global_everything = [];

app.use(express.json()); 

///////////////////

app.post('/ab', async (req, res) => {
  try {
    const { uid, grade } = req.body;

 

    const findd = await Usermarks.findOne({ uid });

    if (!findd) {
      await Usermarks.create({ uid, grade });
      return res.status(200).json({ message: "Usermark created successfully" });
    } else {
      return res.status(400).json({ error: 'Usermark with the given uid already exists' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


///////////////////

app.put('/ab/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const { grade } = req.body;
 
    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({ error: 'Invalid uid format' });
    }

    const existingUsermark = await Usermarks.findOne({ uid });

    if (existingUsermark) {
      await Usermarks.findOneAndUpdate(
        { uid: existingUsermark.uid },
        { $set: { grade: grade } },
        { new: true }
      );

      return res.status(200).json({ message: 'Grade updated successfully' });
    } else {
      return res.status(404).json({ error: 'Usermark not found with the given uid' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//////////////////////////////////////////////////
app.get('/ab',(req,res)=>{
  let everything=userSchema.find();
  global_everything=everything;
  res.status(200).json(global_everything);
})

//////////////////////////
let globalAllItems = [];


//CREATE
app.post('/ab', async (req, res) => {
  try {
    const { id, name, age, uid } = req.body;

    console.log("Received data:", id, name, age, uid);
    const existing_user=await Userdetails.findOne({id});
    if(!existing_user)
    {
   const newUser = await Userdetails.create({ id, name, age, uid });
      return res.status(200).json({ user: newUser, message: " created successfully" });
    }
     else{
      throw new Error(`id ${id} already exist on db`);
     }
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: error.message });
  }
});



 
app.get('/allitems', async (req, res) => {
  try {
    const allItems = await Userdetails.find();
    globalAllItems += allItems;
     res.setHeader('X-Aryan','Dark-Horse');
    res.setHeader('Content-Type', 'application/json');
     
    return res.status(200).json({ data: allItems });
     console.log(allItems)
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 
//UPDATE

app.put('/find_and_update/:uid/:new_grade', async (req, res) => {
  try {
    const find_uid = req.params.uid;
    const new_grade = req.params.new_grade;

    const updatedUser = await Usermarks.findOneAndUpdate(
      { userId: find_uid },
      { $set: { grade: new_grade } },
      { new: true }
    );

    if (updatedUser) {
      console.log(`Grade updated successfully for userId ${find_uid}:`, updatedUser);
      res.status(200).json({ message: `Grade updated successfully for userId ${find_uid}`, updatedUser });
     
      globalAllItems = await Userdetails.find();
    } else {
      res.status(404).json({ error: `User with userId ${find_uid} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

 
//DELETE

app.delete('/delete/:uid',async(req,res)=>{
  const item_uid=(req.params.uid);
  
  try{
  await Userdetails.deleteOne({ uid:item_uid });
 
  globalAllItems = await Userdetails.find();

  console.log(globalAllItems);
  res.json({ message: `Item deleted successfully ${item_uid}` });
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  })

const port = 5500;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


module.exports={Userdetails, Usermarks};