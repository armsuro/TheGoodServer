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
        var getSleder = function(position) {
            Sliders.find({
                status: true,
                position: position
            }).exec(function(err, data) {
                if (err) return res.serverError(err)

                res.json(data)
            })
        }
        async.parallel({
            "topSlider": getSleder(1),
            "middleSlider": getSleder(2)
        }, function(err, data) {
            if (err) return res.serverError(err);

            res.json(data);
        });
    },
    uploadImages: function(req, res) {
        req.file('file').upload({
            dirname: '../../protected_files/'
        }, function(error, uploadedFiles) {
            if (error) return res.serverError(error);

            var imageName = uploadedFiles[0].fd.split("protected_files/")[1];

            var url = DOMAIN_NAME + "/getImages/" + imageName;

            res.json(url);
        });
    },
    getImages: function(req, res) {
        var file = req.param('file');

        var filePath = sails.config.appPath + "/protected_files/" + file;
        if (fs.existsSync(filePath)) {
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.json(400, Msg.getMessage(400))
        }
    },
    getCategories: function(req, res) {
        Categories.find({
            status: 1
        }).exec(function(err, data) {
            if (err) return res.serverError(err)

            res.json(data)
        })
    },
    getProducts: function(req, res) {
            console.log(111)
        if (req.body.page && req.body.page.currentPage && req.body.page.limit) {
            var condition = {
                "status": 1
            }

            if (req.body.filter) {
                condition["category_id"] = req.body.filter
            }

            Products.count(condition).exec(function(err, count) {
                if (err) return res.serverError(err)

                Products.find(condition).paginate({
                    page: req.body.page.currentPage,
                    limit: req.body.page.limit
                }).sort('id DESC').exec(function(err, data) {
                    if (err) return res.serverError(err)

                    res.json({
                        "count": count, "data": data
                    })
                })
            })
        } else {
            res.json(400, Msg.getMessage(400))
        }
    }
}