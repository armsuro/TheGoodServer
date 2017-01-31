module.exports = {
    getAllTemplates: function(req, res) {
        MessageTemplates.find({
            company_id: req.user.company.id
        }).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data)
        })
    },
    getTemplate: function(req, res) {
        MessageTemplates.findOne(req.body.id).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data)
        })
    },
    createMessageTemplate: function(req, res) {
        req.body.company_id = req.user.company.id;
        MessageTemplates.create(req.body).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data)
        })
    },
    updateMessageTemplate: function(req, res) {
        MessageTemplates.update({
            id: req.body.id
        }, req.body).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data);
        });
    },
    deleteMessageTemplate: function(req, res) {
        MessageTemplates.destroy({
            id: req.body.id
        }).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data);
        });
    }
}