const express = require("express");
const app = express();
const path = require("path");
const Swal = require('sweetalert2')
const userRoute = require("./routes/user/user");
const adminRoute = require("./routes/admin/admin");
const rootRoute = require('./routes/root')
const dbConnect = require("./config/database");
const upload = require('./controllers/imageController')
const {sessionMiddleware,setNoCache} = require('./middlewares/sessionMiddleware')
const timeout = require('express-timeout-handler')

const flash = require('connect-flash')
const error = require('./middlewares/errorMiddleware')




app.use(setNoCache);

app.use(sessionMiddleware);

// app.use(errorMiddleware)
app.use(flash())

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

app.use('/',rootRoute)
app.use("/user", userRoute);
app.use("/admin", adminRoute);






app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.use('/uploads', express.static('uploads'));     
app.use(timeout.handler({
          timeout: 10000, 
          onTimeout: function(req, res) {
                    req.session.errorOccured = true
            res.status(404).redirect('/user/error')
          }
        }));
        app.use((req, res) => {
          req.session.errorOccured = true

          res.status(404).redirect('/user/error')
        });

app.use(error)


dbConnect().then(() => {
          app.listen(8080, () => console.log("listening to port 3000"));
});













