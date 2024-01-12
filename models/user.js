const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');
const { createTokenForUser } = require('../services/auth');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: "/defaultImages/default_profilePhoto.jpg"
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: "USER"
    }
},
    {timestamps: true}
);

userSchema.pre('save', function (next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
                            .update(user.password)
                            .digest('hex');
    
    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {

    const user = await this.findOne({email});
    console.log('User found:', user);

    if(!user){
        console.log('User not found. Throwing error...');
        throw new Error('User not found, check your email again or sign up');
    }

    const salt = user.salt;
    const registeredPassword = user.password;

    const loginPassword = createHmac('sha256', salt)
                                .update(password)
                                .digest('hex');

    if(loginPassword !== registeredPassword){
        console.log('Password mismatch. Throwing error.');
        throw new Error ('Incorrect Password');
    }

    const token = createTokenForUser(user);
    return token;
})

const User = model('User', userSchema);

module.exports = User;