const bcrypt = require('bcryptjs');

const hash = (data) => {
    const salt = bcrypt.genSaltSync(10);
    const result = bcrypt.hashSync(data, salt);
    return result;
}

module.exports = hash;