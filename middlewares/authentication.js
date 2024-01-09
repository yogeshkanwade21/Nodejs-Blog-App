const { verifyToken } = require("../services/auth");

function checkAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (tokenCookieValue) {
                const userPayload = verifyToken(tokenCookieValue);
                req.user = userPayload; 
        }

        next();
    };
}

module.exports = {checkAuthenticationCookie};