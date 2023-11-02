const express = require("express");
const app = express();
const path = require("path");

const userRoute = require("./routes/user/user");
const adminRoute = require("./routes/admin/admin");
const dbConnect = require("./config/database");
const session = require("express-session");



// connect to database


app.use(express.urlencoded({extended: true}));


app.use(session({secret: "your-secret-key", resave: false, saveUninitialized: true}));


app.use("/user", userRoute);
app.use("/admin", adminRoute);



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

const multer = require('multer')
app.use('/uploads',express.static('uploads'))
const storage = multer.diskStorage({
          destination : (req,file,cb)=>{
                    cb(null,'/uploads')
          },
          filename : (req,file,cb)=>{
                    cb(null,file.originalname)
          }
          
})
const upload = multer({storage:storage})
     

dbConnect().then(() => {
          app.listen(3000, () => console.log("listening to port 3000"));
});













