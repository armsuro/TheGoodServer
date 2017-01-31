module.exports = {
    createAboutUs: function(req, res) {
        if (req.body.text) {

            AboutUs.create({
                text: req.body.text
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    updateAboutUs: function(req, res) {
        if (req.body.id && req.body.text) {
            AboutUs.update({
                id: req.body.id
            }, {
                text: req.body.text
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    }
}