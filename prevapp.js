import express from "express"
import {config} from "dotenv"
import moment from 'moment';
import { User } from "./models/user.js"
import { Temprature } from "./models/temp.js"
import { BloodPressure} from "./models/bp.js"
import { connect } from "mqtt"; // import connect from mqtt
export const app=express();
let client = connect('mqtt://broker.hivemq.com:1883'); // create a client
const topic_mqtt_receive = 'Vansh_Iot/temp';
const bp_mqtt_receive = 'Vansh_Iot/bp';
let temp;
let bp;
config({
    path:"./data/config.env"
})
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Ok report hai");
})
app.get("/temp",(req,res)=>{
    res.send(temp);
})

client.on('connect', async () => {
    console.log('MQTT Connected');

    await client.subscribe(topic_mqtt_receive);
    await client.subscribe(bp_mqtt_receive);
})
client.on('message', async (topic, message) => {
    console.log('\n[MQTT Received] Topic:', topic, ', Message:', message.toString());

    let data = message.toString();
    data = JSON.parse(data);
    data.createdAt = moment().utc().add(5, 'hours');
    //saving in variable
    if (topic === 'Vansh_Iot/temp') {
        temp = data.value;
        console.log(`Received temperature: ${temp}`);
         // Save live data into database
         await saveTempData(data);
      } else if (topic === 'Vansh_Iot/bp') {
        bp = data.value;
        console.log(`Received blood pressure: ${bp}`);
         // Save live data into database
        await saveBpData(data);
      }
   
})
const saveTempData = async (data) => {
    data = new Temprature(data);
    data = await data.save();
    console.log('Saved data:', data);
}
const saveBpData = async (data) => {
    data = new BloodPressure(data);
    data = await data.save();
    console.log('Saved data:', data);
}


// cheking ke liye publish message= {"type":"temp","value":5}