if(process.env.NODE_ENV !== "production"){
	require("dotenv").config();
}

const express = require("express"),
	  app = express(),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  flash = require("connect-flash"),
	  passport = require("passport"),
	  localStrategy = require("passport-local"),
	  passportLocalMongoose = require("passport-local-mongoose"),
	  methodOverride = require("method-override"),
	  Museum = require("./models/museum"),
	  Comment = require("./models/comment"),
	  User = require("./models/user"),
	  seedDB = require("./seeds");

const museumRoutes = require("./routes/museums"),
	  commentRoutes = require("./routes/comments"),
	  indexRoutes = require("./routes/index");

mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
// Terminal: export DATABASEURL="mongodb://localhost/muse_me"
mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR:", err.message);
});

app.locals.moment = require("moment");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Seed the database
// seedDB();

// Passport config
app.use(require("express-session")({
	secret: "I know China more than anybody else!!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Requiring routes
app.use(indexRoutes);
app.use("/museums", museumRoutes);
app.use("/museums/:id/comments/", commentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("The MuseMe Server Has Started!");
});
