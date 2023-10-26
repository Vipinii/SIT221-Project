//All the server connection and database are in thes server file
import { app } from "./app.js";
import { connectDB } from "./data/database.js";

connectDB();
app.listen(process.env.PORT,(req,res)=>{
    console.log("server is working");
})


