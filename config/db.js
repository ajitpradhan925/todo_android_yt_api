const mongoose = require('mongoose');

const connectDB =async () => {
    const conn =await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      });
    
      console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold);

    }

    module.exports = connectDB;