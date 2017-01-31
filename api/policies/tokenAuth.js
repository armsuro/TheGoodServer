/**
 * tokenAuth
 *
 */
module.exports = function(req, res, next) {

    var token = req.isSocket ? req.socket.handshake.query.token : req.headers['authorization'];

    Users.findOne().where({
        or: [{
            token: token
        }, {
            secret_key: token
        }]
    }).where({
        is_active: 1
    }).populate('company').populate('plan').exec(function(err, user) {
        if (user) {
            req.user = user;
            var count = user.company.vip ? 59 : 29;

            request = limiter(require("request")).to(count).per(1000);
            next();
        } else {
            if (req.isSocket) {
                req.socket.disconnect();
            }
            res.forbidden('Please Authorize.');
        }
    });
};