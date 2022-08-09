const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');

const Data = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`, {encoding: "utf-8"}));

dotenv.config({
	path: `${__dirname}/../config.env`
});

const DB = process.env.DATABASE_LOCAL;

(async () => {
	try {
		await mongoose
			.connect(DB, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: false,
				useUnifiedTopology: true
			})
		console.log(process.argv);
		if (process.argv[2] === '--clear') {
			await Tour.deleteMany();
			console.log('done..')
		} else {
			await Tour.insertMany(Data);
			console.log('insert done...')
		}
	} catch (err) {
		console.log(err)
	}
	
	process.exit(0);
})()