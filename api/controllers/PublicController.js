module.exports = {
    sendContuctUs: function(req, res) {
        if (req.body.email && req.body.message) {
            ContuctUs.create(req.body).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            req.json(401, Msg.getMessage(401, "Email or message required"))
        }
    },
}