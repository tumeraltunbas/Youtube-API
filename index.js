import express from "express";
import connectDatabase from "./helpers/database/connectionHelper.js";
import dotenv from "dotenv";
import errorHandler from "./middlewares/error/errorHandler.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config({path:"./config/.env"});
const app = express(); //an app created from express's constructor.
connectDatabase();
app.use(express.json()); //body-parser
app.use(cookieParser()); //cookie-parser
app.use("/", routes);
app.use(errorHandler);
app.listen(process.env.PORT, () => console.log(`Server started at ${process.env.PORT}`));