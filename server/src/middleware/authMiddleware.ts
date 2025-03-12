const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
require("dotenv").config();

const authMiddleware = jwt({
    secret: jwksRsa.expressJwtSecret({
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
        cache: true,
        rateLimit: true,
    }),
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
});

module.exports = authMiddleware;
