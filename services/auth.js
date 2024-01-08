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
    try {
        const payload = jwt.verify(token, secretPhrase,(err, user)=> {
            console.log("token verified", payload);
            return payload;
        });
    } catch (error) {
        console.error('Token verification failed:', err.message);
    }
}

module.exports = {createTokenForUser, verifyToken};