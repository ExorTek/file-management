module.exports = function notFound(req, res) {
    res.status(404).json({
        success: false,
        status: 404,
        message: 'Not Found!',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
}
