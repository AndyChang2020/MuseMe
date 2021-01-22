const express = require("express"),
	  router = express.Router({mergeParams: true}),
	  Museum = require("../models/museum"),
	  middleware = require("../middleware"),
	  multer = require('multer'),
	  { storage } = require("../cloudinary"),
	  upload = multer({ storage }),
	  { cloudinary } = require("../cloudinary"),
	  mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
	  mapBoxToken = process.env.MAPBOX_TOKEN,
	  geocoder = mbxGeocoding({ accessToken: mapBoxToken });


//Index - show all museums
router.get("/", (req, res) => {
	let perPage = 8;
	let pageQuery = parseInt(req.query.page);
	let pageNumber = pageQuery ? pageQuery : 1;
	let findObj = {};
	if(req.query.search){
		findObj.name = new RegExp(escapeRegex(req.query.search), "gi");
	}
	
	Museum.find({}).exec((err, allMuseums) => {
		Museum.find(findObj).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, museums) => {
			Museum.countDocuments().exec((err, count) => {
				if(err){
					console.log(err);
				}
				else if(req.query.search && museums.length < 1){
					req.flash("error", "No such museum found!");
					res.redirect("back");
				}
				else{
					res.render("museums/index", {
						allMuseums: allMuseums,
						museums: museums,
						page: "museums",
						current: pageNumber,
						pages: Math.ceil(count / perPage),
						search: req.query.search
					});
				}
			});
		});	
	});
});

//NEW - show form to create new museum
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("museums/new");
});

//CREATE - add new museum to database
router.post("/", middleware.isLoggedIn, upload.array("image"), async (req, res) => { 
	const name = req.body.name,
		  images = req.files.map(f => ({ url: f.path, filename: f.filename })),
		  addr = req.body.address,
		  price = req.body.price,
		  cont = req.body.contact,
		  desc = req.body.description,
		  author = {
			  id: req.user._id,
			  username: req.user.username
		  };
	
	const geoData = await geocoder.forwardGeocode({
		query: addr,
		limit: 1
	}).send();
	
	const newMuseum = {
		name: name, images: images,
		address: addr, price: price, contact: cont,	   
		description: desc, author: author,
		geometry: geoData.body.features[0].geometry
	};
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
	Museum.findById(req.params.id).populate("comments").exec((err, museum) => {
		if(err){
			console.log(err);
		}
		else{
			res.render("museums/show", {museum: museum});
		}
	});
});

// EDIT - show form to edit existing museum
router.get("/:id/edit", middleware.checkMuseumOwnership, (req, res) => {
	Museum.findById(req.params.id, (err, museum) => {
		res.render("museums/edit", {museum: museum});
	});
});

// UPDATE - add edited museum to database
router.put("/:id", middleware.checkMuseumOwnership, upload.array("image"), async (req, res) => {
	Museum.findByIdAndUpdate(req.params.id, req.body.museum, async (err, museum) => {
		if(err){
			res.redirect("/museums");
		}
		else{
			const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
			museum.images.push(...imgs);
			await museum.save();
			if(req.body.deleteImages){
				for(let filename of req.body.deleteImages){
					cloudinary.uploader.destroy(filename);
				}
				await museum.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
			}
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
