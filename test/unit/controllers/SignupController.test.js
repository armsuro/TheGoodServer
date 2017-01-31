var request = require('supertest')(url);
var userId;
describe("Signup Controller", function() {
    it("Signup client", function(done) {
        var req = request.post("signup/reginstrationClients");
        req.send({
            "step": 5,
            "price_plan": 1,
            "user": {
                "first_name": "Unit",
                "last_name": "Test",
                "username": "unitTesting",
                "hasError": false,
                "email": "unit@test.com",
                "password": "test1234@A",
                "confirmPassword": "test1234@A"
            },
            "phone": "12052162697",
            "billing": {
                "company": "Forever testing",
                "phone_number": "1111111111",
                "address": "Yerevan",
                "city": "Yerevan",
                "state": "AK",
                "zip_code": "222"
            },
            "card": {
                "name": "Suren Gasparyan",
                "number": "4111111111111111",
                "exp_month": 11,
                "exp_year": 2022,
                "cvc": "222"
            }
        })
        req.end(function(err, res) {
            if (err) throw err;

            userId = JSON.parse(res.text).id;

            done()
        })
    }), it("Remove client", function(done) {
        var req = request.post("users/removeClient");
        req.set('Authorization', authorizationHeader);
        req.send({
            "id": userId
        })
        req.end(function(err, res) {
            if (err) throw err;

            JSON.parse(res.text);

            done()
        })
    })
})