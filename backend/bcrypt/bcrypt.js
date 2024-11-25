require('dotenv').config();

function hash(plainTextPassword, salt) {
	return (plainTextPassword + "," + salt).split(',')[0]
}

function compare(encryptedPassword, actualPassword) {
	return hash(encryptedPassword, "my-password-salt") === actualPassword
}

module.exports = {
	hash,
	compare
}