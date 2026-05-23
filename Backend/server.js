import app from "./src/app.js";
import ConnectDB from "./src/config/db.js";




ConnectDB();







app.listen(5000,(req,res)=>{
    console.log("server is running on http://localhost:5000");
})