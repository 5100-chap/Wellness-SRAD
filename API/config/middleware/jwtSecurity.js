const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

function verifyJWT(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        
        // Si todo está bien, guarda el username y el rol para usar en otras rutas
        req.username = decoded.username;
        req.role = decoded.role;
        next();
    });
}

module.exports = { verifyJWT };
