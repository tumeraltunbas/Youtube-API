import express from "express";
import connectDatabase from "./helpers/database/connectionHelper.js";
import dotenv from "dotenv";
dotenv.config({path:"./config/.env"});
const app = express(); //an app created from express's constructor.
connectDatabase();
app.use(express.json()); //body-parser
app.listen(process.env.PORT, () => console.log(`Server started at ${process.env.PORT}`));