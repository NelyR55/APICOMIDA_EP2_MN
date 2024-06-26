const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/apicomida', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado con MongoDB...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
