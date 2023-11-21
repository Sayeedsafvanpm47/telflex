const express = require("express");
const app = express();
const path = require("path");
const Swal = require('sweetalert2')
const userRoute = require("./routes/user/user");
const adminRoute = require("./routes/admin/admin");
const dbConnect = require("./config/database");
const upload = require('./controllers/imageController')
const {sessionMiddleware,setNoCache} = require('./middlewares/sessionMiddleware')




app.use(setNoCache);

app.use(sessionMiddleware);

app.use(express.urlencoded({extended: true}));
app.use(express.json())
// app.use((err, req, res, next) => {
//           if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//             console.error('Bad JSON in request body:', err);
//             res.status(400).send({ error: 'Invalid JSON' });
//           } else {
//             next();
//           }
//         });
// app.use(session({secret: "your-secret-key", resave: false, saveUninitialized: true}));


app.use("/user", userRoute);
app.use("/admin", adminRoute);





app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.use('/uploads', express.static('uploads'));     



dbConnect().then(() => {
          app.listen(3000, () => console.log("listening to port 3000"));
});













