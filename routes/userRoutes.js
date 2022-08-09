const express = require('express');
const {
	getUser,
	createUser,
	deleteUser,
	updateUser
} = require('../controllers/userController');

const router = express.Router();

router
	.route('/:id')
	.get(getUser)
	.post(createUser)
	.delete(deleteUser)
	.patch(updateUser);

module.exports = router;