var request = require('supertest')(url);

describe("Inbounds Controller", function() {
    it("Send message to user", function(done) {
        var req = request.post("inbounds/sendMessageToUser");
        req.set('Authorization', authorizationHeader);
        req.send({
            phone: "7277777386",
            message: "Text mesaage for unit test Inbounds"
        })
        req.end(function(err, res) {
            if (err) throw err;

            JSON.parse(res.text);

            done()
        })
    }), it("Send inbound", function(done) {
        var req = request.post("inbounds/sendInbound");
        req.set('Authorization', authorizationHeader);
        req.send({
            from: "7277777386",
            body: "Text mesaage for unit test Inbounds answer",
            to: "14804825433",
            id: "11111111"
        })
        req.end(function(err, res) {
            if (err) throw err;

            JSON.parse(res.text);

            done()
        })
    })
})