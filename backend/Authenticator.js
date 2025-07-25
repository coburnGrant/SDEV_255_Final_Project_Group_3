const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class Authenticator {
    static envSecret = process.env?.JWT_SECRET;

    static secret() {
        return this.envSecret ? this.envSecret : "supersecret"
    }

    static createToken(userId) {
        return jwt.sign({ userId: userId }, this.secret(), { expiresIn: '1h' });
    }

    static verifyToken(token) {
        return jwt.verify(token, this.secret());
    }

    static async hashedPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    static async passwordMatches(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = Authenticator;