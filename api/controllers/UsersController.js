/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var extend = require('util')._extend;
var validateUser = function(user) {
    var password = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})")
    var email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (password.test(user.password) && email.test(user.email)) {
        return true;
    } else {
        return false
    }
}
module.exports = {
    signIn: function(req, res) {
        if (req.method == "POST") {

            var username = req.body.username;
            var password = crypto.createHash('md5').update(req.body.password).digest("hex");
            Users.findOne({
                username: username,
                password: password,
                "is_active": 1
            }, {
                select: ['username', 'first_name', 'last_name', 'password', 'email', 'role_group_id', 'token', 'is_active', 'createdAt', 'updatedAt', 'update_card', 'debt', 'company_id', 'referral_id', 'stripe_user_id']
            }).populate('role').populate('company').exec(function(err, user) {
                if (err) return res.serverError(err);

                if (user) {
                    if (user.role.id == 3 && !req.body.manage) {
                        return res.json(409, Msg.getMessage(409, "Access Denied"));
                    } else if (user.role.id != 3 && req.body.manage) {
                        return res.json(409, Msg.getMessage(409, "Access Denied"));
                    } else {
                        UsersNotifications.find({
                            status: 0,
                            deleted: 0,
                            user_id: user.id
                        }).populate("notification").exec(function(err, data) {
                            if (err) return res.serverError(err)
                            user.notifications = data
                            var tokenText = Date.now() + user.username + user.id;
                            user.token = crypto.createHash('md5').update(tokenText).digest("hex");
                            var response = extend({}, user);
                            user.save(function(err) {
                                if (err) return res.serverError(err);
                                return res.json(response);
                            });
                        })

                    }
                } else {
                    return res.json(409, Msg.getMessage(409));
                }
            });
        }
    }
};