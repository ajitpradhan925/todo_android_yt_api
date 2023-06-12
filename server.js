const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const colors = require('colors')
const morgan = require('morgan')

const socket =  require('socket.io')
const app = express();

const userModel = require('./models/User');

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

app.use('/api/massages',require('./routes/massagesRoute'));



const PORT = process.env.PORT || 4000;
const server = app.listen(PORT,
  console.log(`Server running mode on port ${PORT}`.red.underline.bold)

);

const io = socket(server,{
   maxHttpBufferSize: 1e8,
    cors:{
        origin : "http://192.168.1.2:4000",
        credentials : true,
    },

});



global.onlineUsers = new Map();

io.on("connection",(socket)=>{
  
  global.chatSocket = socket;

 /*  socket.on("add-user",(userId)=>{

    console.log(userId+" : socket ID : "+socket.id);
    onlineUsers.set(userId,socket.id);

   // io.emit('onlineStatus', { userId, isOnline: true });

  }); */

  socket.on('add-user',async function(userId){

    onlineUsers.set(userId,socket.id);
    await userModel.findByIdAndUpdate({_id:userId},{$set : {is_online :  '1'}});

    console.log("getOnlineUser : "+userId);
    socket.broadcast.emit('getOnlineUser',{user_id : userId});

  });


  socket.on('stop',async function(userId){

    console.log("stop : "+userId);
    console.log("User ID : "+userId);
    await userModel.findByIdAndUpdate({_id:userId},{$set : {is_online :  '0'}});
    socket.broadcast.emit('getOfflineUser',{user_id : userId});
  });




  socket.on('checkOnlineStatus', (data) => {

    const sendUserSocket = onlineUsers.get(data.from);
    
    const isOnline = onlineUsers.has(data.to);

    console.log("Call : "+data.to+" is online : "+isOnline);

    const toUserId = data.to;

  

  });

  

  socket.on("send-msg",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("Reciving MAssage : "+data.date);
    
    if(sendUserSocket){
       console.log("massageID : "+data.massageID +"Massage  : "+data.message+" sendUserSocket : "+sendUserSocket);
       socket.to(sendUserSocket).emit("msg-receive",data);
    }
  });


  socket.on("typing",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("In typing ... : "+data);
    console.log(sendUserSocket);
    
    if(sendUserSocket){
       socket.to(sendUserSocket).emit("typing",data);
    }
  });

  socket.on("typingStop",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    console.log("In typing ... : "+data);
    console.log(sendUserSocket);
    
    if(sendUserSocket){
       socket.to(sendUserSocket).emit("typingStop",data);
    }
  });



  socket.on('messageSeen', (messageId) => {
    // Update the "seen" status in the database
    // Set the "seen" field to `true` for the specified message ID

    // Emit the updated "seen" status to the sender
    io.emit('messageSeen', messageId);
  });



});


