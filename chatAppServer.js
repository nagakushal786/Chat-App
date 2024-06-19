import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import {connect} from "./config.js";
import { chatModel } from "./chat.schema.js";

const app=express();

// 1. Create a http server
const server=http.createServer(app);

// 2. Create a socket server
const io=new Server(server, {
  cors:{
    origin:'*',
    methods:["GET", "POST"]
  }
});

// 3. Use the socket events
io.on('connection', (socket)=>{
  console.log("Connection is established");

  socket.on('new_user', (data)=>{
    socket.username=data;
    // send old messages to the clients
    chatModel.find().sort({timestamp:1}).limit(50).then(messages=>{
      socket.emit('load_messages', messages);
    }).catch(err=>{
      console.log(err);
    });
  });

  socket.on('new_message', (message)=>{
    // Broadcast that message to all the clients
    const userMessage={
      username: socket.username,
      message: message
    }

    const newChat=new chatModel({
      username: socket.username,
      message: message,
      timestamp: new Date().toISOString()
    });
    newChat.save();

    socket.broadcast.emit('broadcast_message', userMessage);
  });

  socket.on('disconnect', ()=>{
    console.log("Connection is disconnected");
  });
});

server.listen(3000, ()=>{
  console.log("Server is listening at port 3000");
  connect();
});