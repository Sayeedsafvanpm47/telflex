const express = require("express");
const app = express();
const path = require("path");
const userRoute = require("./routes/user/user");
const adminRoute = require("./routes/admin/admin");
const rootRoute = require("./routes/root");
const dbConnect = require("./config/database");
const { sessionMiddleware, setNoCache } = require("./middlewares/sessionMiddleware");
const errorMiddleware = require('./middlewares/errorMiddleware')
const error = require("./middlewares/errorMiddleware");
const morgan = require('morgan')

app.use(setNoCache);

app.use(sessionMiddleware);

app.use(morgan('tiny'));




app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(errorMiddleware)

app.use("/", rootRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use("/uploads", express.static("uploads"));
app.use((req, res) => {
	req.session.errorOccured = true;

	res.status(404).redirect("/user/error");
});

app.use(error);


dbConnect().then(() => {
	app.listen(8080, () => console.log("listening to port 3000"));
});
