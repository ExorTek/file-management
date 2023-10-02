const {ALLOW_LIST} = process.env;
const corsOptionsDelegate = (req, callback) => callback(null, {
    origin: (ALLOW_LIST.split(';').indexOf(req.header('Origin'))) !== -1,
})
module.exports = corsOptionsDelegate;
