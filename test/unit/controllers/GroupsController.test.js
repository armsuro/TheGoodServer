var request = require('supertest')(url);
var supscriberId;

describe("Groups Controller", function() {
    it("Check create subscribers", function(done) {
        var req = request.post("groups/sendIndividual");
        req.set('Authorization', authorizationHeader);
        req.send({
            list_name: "Group for unit tests",
            first_name: "Suren",
            last_name: "Gasparyan",
            phone: "7277777386",
            message: "Text mesaage for unit test"
        })
        req.end(function(err, res) {
            if (err) throw err;

            if (res.text) {
                supscriberId = JSON.parse(res.text).user;
            }

            done()
        })
    }), it("Import supscriber list", function(done) {
        var req = request.post("groups/importSubscribers");
        req.set('Authorization', authorizationHeader);
        req.send({
            list_name: "Group for unit tests",
            subscribers: [{
                full_name: "Davit Davtyan",
                phone: 17894111111,
                reference_id: 1111
            }, {
                full_name: "Suren",
                phone: 17894222112
            }, {
                phone: 17897777113
            }]
        })
        req.end(function(err, res) {
            if (err) throw err;

            JSON.parse(res.text)
            done()
        })
    }), it("Delete recorde in supscriber list", function(done) {
        var req = request.post("groups/deleteGroupUser");
        req.set('Authorization', authorizationHeader);
        req.send({
            "id": supscriberId,
        })
        req.end(function(err, res) {
            if (err) throw err;
            JSON.parse(res.text)
            done()
        })
    })
})