module.exports = {
    createPricingPlan: function(req, res) {
        PricingPlans.create(req.body).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data);
        });
    },
    deletePricingPlan: function(req, res) {
        PricingPlans.destroy(req.body.id).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data);
        });
    },
    updatePricingPlan: function(req, res) {
        PricingPlans.update({
            id: req.body.id
        }, req.body).exec(function(err, data) {
            if (err) res.serverError(err);

            res.json(data);
        });
    }
}