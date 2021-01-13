const Museum = require("../models/museum"),
	  Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};

middlewareObj.checkMuseumOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Museum.findById(req.params.id, (err, foundMuseum) => {
			if(err){
				req.flash("error", "Museum not found.");
				res.redirect("back");
			}
			else{
				if(foundMuseum.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if(err){
				req.flash("error", "Comment not found.");
				res.redirect("back");
			}
			else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}
	else{
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
};

module.exports = middlewareObj;
