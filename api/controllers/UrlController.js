module.exports = {
    getEncryptUrl: function(req, res) {
        var data = req.body.url;

        Promise.map(data, function(url) {
            return new Promise(function(resolve, reject) {
                OtherHelper.encrypt(LinkTracker, 4, 1).then(function(encrypt) {
                    resolve({
                        url: url,
                        code: SHORT_URL + "/url/" + encrypt
                    })
                })
            })
        }).then(function(data) {
            var urls = {}
            data.map(function(url) {
                return urls[url["url"]] = url["code"]
            });
            res.json(urls);
        })
    },
    uploadImages: function(req, res) {
        req.file('file').upload({
            dirname: '../../protected_files/'
        }, function(error, uploadedFiles) {
            if (error) return res.serverError(error);

            var imageName = uploadedFiles[0].fd.split("protected_files/")[1];

            var url = DOMAIN_NAME + "/url/get/" + imageName;

            res.json(url);
        });
    },
    getUrl: function(req, res) {
        LinkTracker.findOne({
            encrypt: req.params.encrypt
        }).exec(function(err, link) {
            if (err) return res.serverError(link);

            if (link && link.status) {
                LinkTeackerLogs.create({
                    link_id: link.id,
                    url: link.url,
                    group_id: link.group_id
                }).then(function(data) {
                    res.redirect(link.url);
                })
            } else {
                res.redirect(DOMAIN_URL);
            }
        })
    },
    get: function(req, res) {
        var file = req.param('file');

        var filePath = sails.config.appPath + "/protected_files/" + file;
        if (fs.existsSync(filePath)) {
            fs.createReadStream(filePath).pipe(res);
        }else{
            res.json(400, Msg.getMessage(400))
        }
    },
    changeLinkStatus: function(req, res) {
        LinkTracker.query("UPDATE `link_tracker` SET `status`=0 WHERE DATE(created_at) < DATE_ADD(NOW(),INTERVAL -1 MONTH)", function(err, data) {
            if (err) return res.serverError(err)

            res.json(true)
        })
    }
}