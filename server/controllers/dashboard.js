const User = require("../models/User");
const mongoose = require("mongoose");
const StoreSchema = require("../models/table");

exports.search = async (req, res) => {
    storage = mongoose.model(req.body.dbName + "es", StoreSchema);
    await storage.create({
      name: "123",
      price: -1,
      left: 123,
      total: 123,
    });
    await storage.deleteMany({ price: -1 });
    // console.log(await storage.find());
    const a = req.params.query.toLowerCase();
    res.send(await storage.find({ name: { $regex: a, $options: "i" } }));
}

exports.getData = async (req, res) => {
    storage = mongoose.model(req.body.dbName + "es", StoreSchema);
    await storage.create({
      name: "123",
      price: -1,
      left: 123,
      total: 123,
    });
    await storage.deleteMany({ price: -1 });
    res.send(await storage.find());
}

exports.getUser = async (req, res) => {
    let data = await User.findById(req.params.id);
    res.send(data);
}

exports.enterData = async (req, res) => {
    const { name, price, left, total } = req.body;
    storage = mongoose.model(req.body.dbName + "es", StoreSchema);
    await storage.create(
      {
        name: name,
        price: price,
        left: left,
        total: total,
      },
      function (err, doc) {
        if (err) {
          res.send(err);
          console.log(err);
        }
      }
    );
}

exports.delData = async (req, res) => {
    const { id } = req.body;
    storage = mongoose.model(req.body.dbName + "es", StoreSchema);
    await storage.deleteOne({ _id: id });
}

exports.changeData = async (req, res) => {
    const { id } = req.body;
    storage = mongoose.model(req.body.dbName + "es", StoreSchema);
    await storage.findByIdAndUpdate(id, {
      name: req.body.name,
      price: req.body.price,
      left: req.body.left,
      total: req.body.total,
    });
    if (req.params.id != undefined) {
      const data = await User.findById(req.params.id);
      var d = new Date();
      let a = data.sales;
      let sum = 0;
      for (let index = 0; index < a.length; index++) {
        sum += a[index].sale;
      }
      if (!data.setWeekReset && d.getDay() == 0) {
        await User.findByIdAndUpdate(req.params.id, {
          prevWeekSales: sum,
          setWeekReset: true,
        });
  
        a = [
          {
            name: "Sunday",
            sale: 0,
          },
          {
            name: "Monday",
            sale: 0,
          },
          {
            name: "Tuesday",
            sale: 0,
          },
          {
            name: "Wednesday",
            sale: 0,
          },
          {
            name: "Thursday",
            sale: 0,
          },
          {
            name: "Friday",
            sale: 0,
          },
          {
            name: "Saturday",
            sale: 0,
          },
        ];
      } else {
        await User.findByIdAndUpdate(req.params.id, {
          setWeekReset: false,
        });
      }
      a[d.getDay()].sale += parseInt(req.params.amount);
      console.log(a);
      await User.findByIdAndUpdate(req.params.id, {
        sales: a,
      });
    }
    await res.sendStatus(200);
}
