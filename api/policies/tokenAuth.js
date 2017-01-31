/**
 * tokenAuth
 *
 */
module.exports = function(req, res, next) {

    var token = req.headers['authorization'];

    Users.findOne().where({
        or: [{
            token: token
        }, {
            secret_key: token
        }]
    }).where({
        is_active: 1
    }).populate('plan').exec(function(err, user) {
        if (user) {
            req.user = user;

            next();
        } else {
            res.forbidden('Please Authorize.');
        }
    });
};