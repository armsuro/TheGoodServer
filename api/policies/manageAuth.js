module.exports = function(req, res, next) {
    if (req.user.role == SURPER_ADMIN_ROLE_ID) {
        next()
    } else {
        res.forbidden('Not permission on this action');
    }
};