module.exports = {
    configutarion: function() {
        return {
            host: "10.10.7.80",
            port: "25",
            domain: "dataowl.io",
            from: "info@dataowl.io",
            subject: "Reset your password",
            authentication: false,
            username: "bulkmailer",
            password: "bulkmailer",
            debug: false
        }
    },
    getTemplate: function(name, username, encript) {
        var filePath = sails.config.appPath + '/email_templates/' + name + '.html'
        return new Promise(function(resolve, reject) {
            fs.readFile(filePath, 'utf8', function(err, data) {
                if (err) return res.serverError(err)

                var newData = data.replace(":USERNAME", username)
                newData = encript ? newData.replace(":ENCRIPT", encript) : newData
                resolve(newData)
            })
        })
    }
};