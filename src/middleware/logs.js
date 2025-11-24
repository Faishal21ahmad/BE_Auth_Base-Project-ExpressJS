const logRequest = (req, res, next) => {
    console.log('Request Terjadi ke PATH: ', req.path);
    next();
}

module.exports = logRequest;
