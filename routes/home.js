const express = require("express");
const Router = express.Router();
const multer = require("multer");
const path = require("path");
const userdata = require("../models/users");
const e = require("express");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/uploads"); // Directory to save uploaded files
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to file name
	},
});

const upload = multer({ storage: storage });

Router.get("/home", async (req, res) => {
	try {
		const users = await userdata.find();
		res.render("home", { users });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
	// const inputData = [
	// 	{
	// 		id: 12345,
	// 		name: "Marvin Hernandez",
	// 		location: "San Leonardo",
	// 		dateNow: new Date().toLocaleDateString(),
	// 	},
	// 	{
	// 		id: 12345,
	// 		name: "Melvin Hernandez",
	// 		location: "San Leonardo",
	// 		dateNow: new Date().toLocaleDateString(),
	// 	},
	// 	{
	// 		id: 12345,
	// 		name: "Maureen Hernandez",
	// 		location: "Caloocan City",
	// 		dateNow: new Date().toLocaleDateString(),
	// 	},
	// 	{
	// 		id: 12345,
	// 		name: "Kevin Agustin",
	// 		location: "Cavite City",
	// 		dateNow: new Date().toLocaleDateString(),
	// 	},
	// ];
	// res.render("home", { inputData });
});

Router.get("/info/:id", async (req, res) => {
	try {
		const user = await userdata.findById(req.params.id);
		if (!user) {
			return res.status(404).send("User not found");
		}
		res.render("info", { user });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

Router.get("/edit/:id", async (req, res) => {
	try {
		const user = await userdata.findById(req.params.id);
		if (!user) {
			return res.status(404).send("User not found");
		}
		res.render("edit", { user });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

Router.get("/create", async (req, res) => {
	res.render("create", { user: {} });
});

Router.post("/new", upload.array("img", 10), async (req, res) => {
	const data = req.body;
	const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

	const user = new userdata({
		name: data.name,
		location: data.location,
		price: Number(data.price),
		advance: Number(data.advance),
		balance: (Number(data.price) - Number(data.advance)).toFixed(2),
		status:
			Number(data.price) - Number(data.advance) === 0 ? "PAID" : "NOT PAID",
		profession: data.profession,
		others: data.others,
		textarea: data.textarea,
		img: imagePaths,
		// dateCreated: new Date().toLocaleDateString(),
		// dateUpdated: ""
	});

	try {
		if (user.advance > user.price) {
			// If price is less than advance, re-render the form with an error message
			res.send("error price must be higher than advance");
			res.render("create", { user });
			return;
		}

		await user.save();
		res.redirect("/home");
	} catch (error) {
		console.error(error);
		res.redirect("create", { user });
		res.status(500).send("Internal Server Error");
	}
});

Router.post("/update/:id", upload.array("img", 10), async (req, res) => {
	try {
		const data = req.body;
		const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
		const updatedUser = await userdata.findByIdAndUpdate(req.params.id, {
			name: data.name,
			location: data.location,
			price: Number(data.price),
			advance: Number(data.advance),
			balance: (Number(data.price) - Number(data.advance)).toFixed(2),
			status:
				Number(data.price) - Number(data.advance) === 0 ? "PAID" : "NOT PAID",
			profession: data.profession,
			others: data.others,
			textarea: data.textarea,
			img: imagePaths,
			// dateCreated: new Date().toLocaleDateString(),
		});
		console.log("successfuly updated");
		res.redirect("/home");
	} catch (error) {
		console.error(error);
	}
});

Router.get("/delete/:id", async (req, res) => {
	try {
		await userdata.findByIdAndDelete(req.params.id);
		console.log(`deleted successfully`);
		res.redirect("/home");
	} catch (error) {
		console.error(error);
	}
});

module.exports = Router;
