const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).send('User not authenticated');
    }
    next();
}

module.exports = authMiddleware;
