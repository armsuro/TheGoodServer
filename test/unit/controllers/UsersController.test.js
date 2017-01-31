var request = require('supertest')(url);
describe("Users Controller", function() {
    it("Signin client", function(done) {
        var req = request.post("users/signIn");
        req.send({
            "username": "suren",
            "password": "1234"
        })
        req.end(function(err, res) {
            if (err) throw err;

           	JSON.parse(res.text);

            done()
        })
    })
})