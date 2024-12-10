if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

//All RequireMents
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const wrapAsync = require("./utils/wrapAsync");
const Expense = require("./models/expense");
const User=require("./models/user");
const expenseRouter = require("./routes/expenseRoute");
const userRouter = require("./routes/userRoute");
const session = require("express-session");
const Mongostore=require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const DB_URL=process.env.ATLASDB_URL;
// Mongoose connectivity


main().then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("Error connecting to DB", err);
});

async function main() {
    await mongoose.connect(DB_URL);
}

//Important Middleware For Functioning
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const store=Mongostore.create({
    mongoUrl:DB_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});
store.on("error" , () => {
    console.log("Error In Mongo Session",err);
})

const sessionOption = {
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user || null;
    res.locals.saveName = req.session.saveName || null;
    console.log(res.locals.success);
    next();
});


//Router's middleWares
app.use("/expenses", expenseRouter);
app.use("/",userRouter);


//Other MiddleWares
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).render("expenses/error.ejs", { message });
});

app.get("/", (req, res) => {
    res.send("working route");
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});