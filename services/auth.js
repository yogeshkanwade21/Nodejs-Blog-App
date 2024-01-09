const jwt = require('jsonwebtoken');

const secretPhrase = 'secretphraseforsecrettokenforsecrettoken';

function createTokenForUser(user) {
    const payload = {
        _id : user._id,
        fullName : user.fullName,
        email : user.email
    }

    const token = jwt.sign(payload, secretPhrase);
    return token;
}

function verifyToken(token) {

    const decodedUser = jwt.verify(token, secretPhrase);
    return decodedUser;
}

module.exports = {createTokenForUser, verifyToken};