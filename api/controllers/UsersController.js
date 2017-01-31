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
            }).populate('role').exec(function(err, user) {
                if (err) return res.serverError(err);

                if (user) {
                    if (err) return res.serverError(err)
                    var tokenText = Date.now() + user.username + user.id;
                    user.token = crypto.createHash('md5').update(tokenText).digest("hex");
                    var response = user;
                    user.save(function(err) {
                        if (err) return res.serverError(err);
                        return res.json(response);
                    });
                } else {
                    return res.json(409, Msg.getMessage(409));
                }
            });
        }
    }
};