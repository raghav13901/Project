const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");

const StoreSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Provide an item name"],
    unique:true
  },
  price:{
    type:Number,
    required:[true,"Provide an item price"]
  },
  left:{
    type:Number,
    required:[true,"Provide an item left"]
  },
  total:{
    type:Number,
    required:[true,"Provide an item total"]
  },
});

let storage;
router.post("/getTableName/:query",async (req,res)=>{
    storage = mongoose.model(req.body.dbName+"es", StoreSchema);
    await storage.create({
        name:"123",
        price:-1,
        left:123,
        total:123
    });
    await storage.deleteMany({price:-1});
    // console.log(await storage.find());
    const a = req.params.query.toLowerCase();
    res.send(await storage.find({name: { "$regex": a , "$options": "i" } }))
});
router.post("/getTable",async (req,res)=>{
  storage = mongoose.model(req.body.dbName+"es", StoreSchema);
  await storage.create({
      name:"123",
      price:-1,
      left:123,
      total:123
  });
  await storage.deleteMany({price:-1});
  console.log(await storage.find());
  res.send(await storage.find());
});
router.get("/getData/:id",async(req,res)=>{
  let data = await User.findById(req.params.id);
  console.log(data);
  res.send(data);
});

router.post("/enterData",async(req,res)=>{
  const {name,price,left,total} = req.body;
  storage = mongoose.model(req.body.dbName+"es", StoreSchema);
    await storage.create({
      name:name,
      price:price,
      left:left,
      total:total
    },function(err,doc){
      if(err){
        res.send(err);
        console.log(err);
      }
    });
});
router.post("/delData",async(req,res)=>{
  const {id} = req.body;
  storage = mongoose.model(req.body.dbName+"es", StoreSchema);
  await storage.deleteOne({_id:id});
});
router.post("/changeData",async(req,res)=>{
  const {id} = req.body;
  storage = mongoose.model(req.body.dbName+"es", StoreSchema);
  await storage.findByIdAndUpdate(id,{
    name:req.body.name,
    price:req.body.price,
    left:req.body.left,
    total:req.body.total,
  });
});
router.post("/search",async(req,res)=>{
  const {sq} = req.body;
  storage = mongoose.model(req.body.dbName+"es", StoreSchema);
  const data = await storage.find({name:sq});
  res.send(data);
});
module.exports = router;
