var Sails = require('sails');
process.env.test_enabled = true;
if (process.env.local_test) {
    url = "http://localhost:1337/";
    authorizationHeader = "1111";
} else {
    url = "https://api.dataowl.io/";
    authorizationHeader = "oP1EkH0yE2K5TonJpE";
}
before(function(done) {
    Sails.lift({

    }, function(err, server) {
        if (err) return done(err)

        done(err, server)
    });
});

after(function(done) {
    sails.lower(done)
})