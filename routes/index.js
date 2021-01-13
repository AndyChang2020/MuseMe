const express = require("express"),
	  router = express.Router(),
	  passport = require("passport"),
	  User = require("../models/user");

// LANDING
router.get("/", (req, res) => {
	res.render("landing");
});

// REGISTER
router.get("/register", (req, res) => {
	res.render("register", {page: "register"});
});

router.post("/register", (req, res) => {
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
 			console.log(err);
        	return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to MuseMe " + user.username + " !");
			res.redirect("/museums");
		});
	});
});

// LOGIN
router.get("/login", (req, res) => {
	res.render("login", {page: "login"});
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/museums",
		failureRedirect: "/login",
		successFlash: "Welcome back!",
		failureFlash: "Incorrect username or password!"
	})
);

// LOGOUT
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/museums");
});

module.exports = router;
