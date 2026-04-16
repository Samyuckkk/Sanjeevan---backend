const mongoose = require("mongoose");

const connectToDatabase = async (mongoUri) => {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = { connectToDatabase };
