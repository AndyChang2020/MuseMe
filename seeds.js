const mongoose = require("mongoose");
	  Museum = require("./models/museum");
	  Comment = require("./models/comment");
 
const seeds = [
	{
		name: "The Broad", 
		images: [
			{
				url: "https://res.cloudinary.com/dsgdflhlo/image/upload/v1610609518/MuseMe/Small-2_jlvdl0.jpg",
				filename: "Small-2_jlvdl0"
			},
			{
				url: "https://res.cloudinary.com/dsgdflhlo/image/upload/v1610609546/MuseMe/Infinity-Mirrored-Room-1-1_vzn7gg.jpg",
				filename: "Infinity-Mirrored-Room-1-1_vzn7gg"
			},
			{
				url: "https://res.cloudinary.com/dsgdflhlo/image/upload/v1610609538/MuseMe/ON-CY070_bas1_G_20190329110137_crveju.jpg",
				filename: "ON-CY070_bas1_G_20190329110137_crveju"
			}
		],
		description: "Three words: Infinity Mirror Rooms. Downtown’s persistently popular contemporary art museum has two of Yayoi Kusama’s immersive, mirror-laden rooms (and the standy queue to prove it). Elsewhere in the free museum, Eli and Edythe Broad’s collection of 2,000 post-war works includes artists like Andy Warhol, Roy Lichtenstein, Ed Ruscha, Cindy Sherman, Barbara Kruger and Jeff Koons. Outside, the museum’s plaza features a lovely olive tree grove that sits in from of Otium, the museum’s signature restaurant from French Laundry alum Timothy Hollingsworth. The museum has been an exciting addition to L.A.’s roster of institutions, though it’s not perfect. Its vault and veil design appears much more opqaque and heavier than it should, though the even, subdued light in the third floor galleries is pleasant. Its collection relies on relatively safe selections and high-priced gallery prizes. That said, visitors will definitely appreciate its encyclopedic survey of contemporary, complete with a handful of spectacle pieces.",
		address: "221 S Grand Ave, Los Angeles, 90012",
		price: "Free, with timed reservations available; $12 parking available",
		contact: "www.thebroad.org",
		author:
		{
            id : "588c2e092403d111454fff76",
            username: "Jack Rabbit"
        }
    },
    {
        name: "Huntington Library, Art Collections & Botanical Gardens", 
        images: [
			{
				url: "https://res.cloudinary.com/dsgdflhlo/image/upload/v1610609932/MuseMe/huntington0_yok6aw.jpg",
				filename: "huntington0_yok6aw"
			},
			{
				url: "https://res.cloudinary.com/dsgdflhlo/image/upload/v1610610314/MuseMe/huntington-library_rothenberg-reading-room-6557_ctvpyw.jpg",
				filename: "huntington-library_rothenberg-reading-room-6557_ctvpyw"
			},
			{
				url: "https://res.cloudinary.com/dsgdflhlo/image/upload/v1610609541/MuseMe/huntington_hnvscr.jpg",
				filename: "huntington_hnvscr"
			}
		],
        description: "Once you’ve paid your admission, you’ll be close to the main library, which holds more than six million items—much of it open only to researchers (apply for credentials in advance of your visit). However, some of its most notable holdings, among them a Gutenberg Bible and the earliest known edition of Chaucer’s The Canterbury Tales, are always on display in the adjoining exhibition hall, alongside regular themed temporary shows. The art collection is almost as notable as the library’s collection. Built in 1910, the main house is home to a very impressive collection of British art, which includes Gainsborough’s The Blue Boy alongside works by Blake, Reynolds and Turner. And over in the newer Scott and Erburu Galleries, you’ll find a selection of American paintings.However, despite all these cultural glories, the Huntington’s highlights are outdoors in its vast jigsaw of botanical gardens, arguably the most glorious in the entire Los Angeles region. The 207 acres of gardens, 120 acres of which are open to the public, are divided into a variety of themes: the Desert Garden, now a century old, is packed with cacti and other succulents; the Shakespeare Garden evokes a kind of Englishness rarely seen in England these days; the Children’s Garden is a delightful mix of educational features and entertaining diversions; and the Japanese garden is quietly, unassumingly magical. Most recent is the Chinese-themed Garden of Flowing Fragrance, a delicate environment built in part by Chinese artisans. Like much of this fabulous place, it’s best approached in slow motion.",
		address: "1151 Oxford Rd, San Marino",
		price: "Weekday: $25; Weekend: $29; Parking free",
		contact: "www.huntington.org",
		author:
		{
            id : "588c2e092403d111454fff71",
            username: "Billy Herrington"
        }
    },
    {
        name: "Griffith Observatory", 
        images:[
			{
				url: "https://res.cloudinary.com/dsgdflhlo/image/upload/v1610609923/MuseMe/vc_spotlight_griffithpark_module1_observatory_rf_601930068_1280x640_zpaoqp.jpg",
				filename: "vc_spotlight_griffithpark_module1_observatory_rf_601930068_1280x640_zpaoqp"
			}
		],
        description: "“If every person could look through that telescope,” declared Griffith J Griffith, “it would revolutionize the world.” More than 80 years after this iconic building opened, the world remains unrevolutionized, and the city smog means that the views are not as crystal-clear as they were in Griffith’s day. However, after a five-year program of renovations at the observatory, the 12 in. Zeiss refracting telescope is once again open to the public, providing the crowning glory for this wonderful old landmark. You could comfortably spend a few hours here just taking in the exhibits and the shows. The ground floor holds the Hall of the Sky and Hall of the Eye, a pair of complementary displays that focus on humans’ relationship to the stars; a Foucault pendulum, directly under Hugo Ballin’s famed mural on the central rotunda; and the handsome, high-tech Samuel Oschin Planetarium. And downstairs, accessible via the campy displays of space-slanted jewelry in the Cosmic Connection Corridor, you’ll find a number of other new exhibits.",
		address: "2800 E Observatory Rd, Los Angeles, 90027",
		price: "Free admission; Planetarium $7",
		contact: "www.griffithobs.org",
		author:
		{
            id : "588c2e092403d111454fff77",
            username: "Jane Goodall"
        }
    }
]
 
async function seedDB(){
	try{
		// await User.deleteMany({});
		// console.log("Users removed");
		await Museum.deleteMany({});
		console.log("Museums removed");
		await Comment.deleteMany({});
		console.log("Comments removed");

		for(const seed of seeds){
			let museum = await Museum.create(seed);
			let comment = await Comment.create(
				{
					text: "This place is great, but I wish there were beer...",
					author:
					{
                    	id : "588c2e092403d111454fff96",
                        username: "Homer Simpson"
                    }
				}
			);
			museum.comments.push(comment);
			museum.save();
			console.log("Museum with comment added");
		}
	}
	catch(err){
		console.log(err);
	}
}     

module.exports = seedDB;
