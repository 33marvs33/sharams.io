const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const homeRouter = require("./routes/home.js");

const app = express();
const port = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/", homeRouter);

const startServer = async () => {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("connected to mongodb");
		app.listen(port, () => console.log(`server started at port: ${port}`));
	} catch (error) {
		console.error(error);
	}
};

startServer();
