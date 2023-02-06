module.exports = function admin(req, res, next) {
    if (req.user.status !== 2)
        return res.status(403).send('Murojaat rad etildi');
    next();
}