import dotenv from "dotenv";

dotenv.config();

if(!process.env.JWT_SECRET){
    throw new Error("There is no any jwt token is found");
}
if(!process.env.REFRESH_SECRET){
    throw new Error("There is no any jwt token is found");
}
// if(!process.env.GOOGLE_CLIENT_ID){
//     throw new Error("There is no any GOOGLE_CLIENT_ID is found");
// }
// if(!process.env.GOOGLE_CLIENT_SECRET){
//     throw new Error("There is no any GOOGLE_CLIENT_SECRET is found");
// }
// if(!process.env.GOOGLE_REFRESH_TOKEN){
//     throw new Error("There is no any refresh token is found");
// }
// if(!process.env.GOOGLE_USER){
//     throw new Error("There is no any Google user is found");
// }

const config = {
    Mongo_URI : process.env.Mongo_URI,
    JWT_SECRET : process.env.JWT_SECRET,
    REFRESH_SECRET : process.env.REFRESH_SECRET,
    // GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    // GOOGLE_REFRESH_TOKEN: process.send.GOOGLE_REFRESH_TOKEN,
    // GOOGLE_USER: process.env.GOOGLE_USER
}

export default config;