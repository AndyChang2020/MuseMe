const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  Museum = require("../models/museum"),
	  middleware = require("../middleware");

//Index - show all museums
router.get("/", (req, res) => {
	let perPage = 8;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
	let findObj = {};
	if(req.query.search){
		findObj.name = new RegExp(escapeRegex(req.query.search), "gi");
	}
	Museum.find(findObj).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allMuseums) => {
		Museum.countDocuments().exec((err, count) => {
			if(err){
				console.log(err);
			}
			else if(req.query.search && allMuseums.length < 1){
				req.flash("error", "No such museum found!");
				res.redirect("back");
			}
			else{
				res.render("museums/index", {
					museums: allMuseums,
					page: "museums",
					current: pageNumber,
					pages: Math.ceil(count / perPage),
					search: req.query.search
				});
			}
		});
	});
});

//NEW - show form to create new museum
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("museums/new");
});

//CREATE - add new museum to database
router.post("/", middleware.isLoggedIn, (req, res) => {
	const name = req.body.name;
    const image = req.body.image;
	const addr = req.body.address;
	const price = req.body.price;
	const cont = req.body.contact;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newMuseum = {name: name, image: image,
					   address: addr, price: price, contact: cont,	   
					   description: desc, author: author};
	Museum.create(newMuseum, (err, museum) => {
		if(err){
			console.log(err);
		}
		else{
			req.flash("success", "Successfully added museum.");
			res.redirect("/museums");
		}			
	});
});

//SHOW - display more info of one museum
router.get("/:id", (req, res) => {
	Museum.findById(req.params.id).populate("comments").exec((err, foundMuseum) => {
		if(err){
			console.log(err);
		}
		else{
			res.render("museums/show", {museum: foundMuseum});
		}
	});
});

// EDIT - show form to edit existing museum
router.get("/:id/edit", middleware.checkMuseumOwnership, (req, res) => {
	Museum.findById(req.params.id, (err, foundMuseum) => {
		res.render("museums/edit", {museum: foundMuseum});
	});
});

// UPDATE - add edited museum to database
router.put("/:id", middleware.checkMuseumOwnership, (req, res) => {
	Museum.findByIdAndUpdate(req.params.id, req.body.museum, (err, updatedMuseum) => {
		if(err){
			res.redirect("/museums");
		}
		else{
			res.redirect("/museums/" + req.params.id);
		}
	});
});

// DESTROY - delete a museum
router.delete("/:id", middleware.checkMuseumOwnership, (req, res) => {
	Museum.findByIdAndRemove(req.params.id, (err) => {
		if(err){
			res.redirect("/museums");
		}
		else{
			req.flash("success", "Museum deleted");
			res.redirect("/museums");
		}
	});
});

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
