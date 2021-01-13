const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  Museum = require("../models/museum"),
	  Comment = require("../models/comment"),
	  middleware = require("../middleware");

//Comments NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Museum.findById(req.params.id, (err, foundMuseum) => {
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {museum: foundMuseum});
		}
	});
});

//Comments CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
	Museum.findById(req.params.id, (err, museum) => {
		if(err){
			console.log(err);
			res.redirect("/museums");
		}
		else{
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					museum.comments.push(comment);
					museum.save();
					req.flash("success", "Successfully added comment.");
					res.redirect("/museums/" + museum._id);
				}			
			});
		}
	});
});

// Comments EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err){
			res.redirect("back");
		}
		else{
			res.render("comments/edit", {museum_id: req.params.id, comment: foundComment});
		}
	});
});

// Comments UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err){
			res.redirect("back");
		}
		else{
			res.redirect("/museums/" + req.params.id);
		}
	});
});

// Comments DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success", "Comment deleted.");
			res.redirect("/museums/" + req.params.id);
		}
	});
});

module.exports = router;
