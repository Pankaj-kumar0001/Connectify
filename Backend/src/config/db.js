import mongoose from "mongoose";
import config from "./config.js";

async function  ConnectDB() {
    await mongoose.connect(config.Mongo_URI);

    console.log("DB is Connected Sucessfully now");
}

export default ConnectDB;