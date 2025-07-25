const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/// Class that provides helper methods for authentication
class Authenticator {
    /// The process's environment's secret for JWTs
    static envSecret = process.env?.JWT_SECRET;

    /// The current secret to use when encoding JWTs
    static secret() {
        return this.envSecret ? this.envSecret : "supersecret"
    }

    /// Creates a JWT for a user ID
    static createToken(userId) {
        return jwt.sign({ userId: userId }, this.secret(), { expiresIn: '1h' });
    }

    /// Verifies a JWT
    static verifyToken(token) {
        return jwt.verify(token, this.secret());
    }

    /// Gets hashed version of password string
    static async hashedPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    /// Compares a password string with it's hashed string
    static async passwordMatches(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

module.exports = Authenticator;