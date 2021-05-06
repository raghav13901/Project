const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  var collections = mongoose.connections[0].collections;
  var names = [];

  Object.keys(collections).forEach(function(k) {
      names.push(k);
  });

  console.log(names);
    console.log("MongoDB Connected");
  };

module.exports = connectDB;
