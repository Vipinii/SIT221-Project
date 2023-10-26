import express from "express"
import {config} from "dotenv"
import http from 'http';
import {WebSocketServer} from 'ws';
import { GetData } from "./controllers/mqtt.js";
import { SendData } from "./controllers/Socket.js";
export const app=express();
config({
  path:"./data/config.env"
})

app.use(express.json())
app.get('/', (req, res) => {
 res.send("Server IS working")
});
 const server = http.createServer(app);
export const wss = new WebSocketServer({ server });
server.listen(4001, () => {
  console.log(' Websocket Server started on port 4001');
});

GetData()
SendData()

// // // cheking ke liye publish message= {"type":"temp","value":5}
