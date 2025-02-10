const express = require("express");
const {connectDB} = require("./config/db.config.js");
const router = require("./routes/router.js");
var cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors({
 origin : "*"
}))
app.use("/",router);

connectDB().then(() =>{
  const PORT = process.env.PORT || 8000;
  app.on("error", (error) =>{
    console.log("ERROR", error);
    throw error
  })
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) =>{
  console.error("MONGO db connection failed !!!" , error)
})
