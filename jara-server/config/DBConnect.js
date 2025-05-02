const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_UR);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
