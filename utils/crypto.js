const crypto = require("crypto");
const salt = crypto.randomBytes(32).toString('hex')
function generatePassword(password) {
    const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return genHash
    
}
function validPassword(password, hash) {
    const checkHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
    return hash === checkHash
}

module.exports = {generatePassword ,validPassword}