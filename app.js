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


dbConnect().then(() => {
          app.listen(3000, () => console.log("listening to port 3000"));
});













