const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const homeRouter = require("./routes/home.js");

const app = express();
const port = process.env.PORT;
const MONGOURI = process.env.MONGOURI;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/", homeRouter);

const startServer = async () => {
	try {
		await mongoose.connect(MONGOURI);
		console.log("connected to mongodb");
		app.listen(port, () => console.log(`server started at port: ${port}`));
	} catch (error) {
		console.error(error);
	}
};

startServer();
