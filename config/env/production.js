module.exports = {
    hookTimeout: 60000000,
    models: {
        connection: 'liveMysqlServer',
        migrate: 'safe',
        seed: function() {
            var self = this;
            var runSql = function(data) {
                for (i in data) {
                    if (data[i] == "01-Schema.sql")
                        continue;
                    else
                        repeatData(data[i]);
                }
            }
            var repeatData = function(migrationName) {
                fs.readFile('api/migrations/' + migrationName, 'utf8', function(err, data) {
                    if (err) {
                        sails.log.error(err);
                    }

                    var queries = data.split(';');

                    for (var i in queries) {
                        self.query(queries[i], function(err, records) {});
                    }
                    Migrations.create({
                        name: migrationName
                    }).exec(function(err, data) {});
                });
            }
            fs.readdir('api/migrations/', function(err, data) {
                Migrations.find({
                    name: data
                }).exec(function(err, getData) {
                    for (i in getData) {
                        var index = data.indexOf(getData[i].name);
                        if (index >= 0) data.splice(index, 1);
                    }
                    runSql(data);
                })
            });
        }
    },
    session: {
        adapter: 'redis',
        url: process.env.REDIS_URL
    }
};