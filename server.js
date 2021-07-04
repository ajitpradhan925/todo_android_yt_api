const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const colors = require('colors')
const morgan = require('morgan')

const app = express();

// https://todoappyt.herokuapp.com/api/todo/auth/register
app.use(morgan('dev'));

app.use(express.json({}));
app.use(express.json({
  extended: true
}))
// use dotenv files
dotenv.config({
  path: './config/config.env'
});

connectDB();



app.use('/api/todo/auth', require('./routes/user'));
app.use('/api/todo', require('./routes/todo'));
const PORT = process.env.PORT || 3000;
app.listen(PORT,
  console.log(`Server running mode on port ${PORT}`.red.underline.bold)

);


