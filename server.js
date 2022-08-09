const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({
	path: `${__dirname}/config.env`
});

const DB = process.env.DATABASE_LOCAL;

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('DB connection succefull');
	}).catch(() => console.log("DB Connection failled"));

const app = require('./app');
 
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`App running on port ${PORT}...`);
});
