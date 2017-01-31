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
    getSliderData: function(req, res) {
        Sliders.find({
            status: true
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    uploadImages: function(req, res) {
        req.file('file').upload({
            dirname: '../../protected_files/'
        }, function(error, uploadedFiles) {
            if (error) return res.serverError(error);

            var imageName = uploadedFiles[0].fd.split("protected_files/")[1];

            var url = DOMAIN_NAME + "/get/" + imageName;

            res.json(url);
        });
    }
}