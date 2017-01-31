var request = require('supertest')(url);
describe("Users Controller", function() {
    it("Signin client", function(done) {
        var req = request.post("users/signIn");
        req.send({
            "username": "suren.gasparyan",
            "password": "test1234@A"
        })
        req.end(function(err, res) {
            if (err) throw err;

           	JSON.parse(res.text);

            done()
        })
    })
})