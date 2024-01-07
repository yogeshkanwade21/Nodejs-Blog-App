const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');

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
        default: "/images/default_profilePhoto"
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

const User = model('User', userSchema);

module.exports = User;