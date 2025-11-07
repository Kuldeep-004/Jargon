import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import {DBConnect} from './db/database';
import authRouter from './routes/authRoute'

const app=express();
app.use(cors());
dotenv.config();

const Port=process.env.port || 3000;

DBConnect();

app.get("/",(req,res)=>
    res.send("<h1>Backend Is Running</h1>")
)

app.use('/',authRouter);

app.listen(Port,()=>console.log(`Server is running on port ${Port}`))