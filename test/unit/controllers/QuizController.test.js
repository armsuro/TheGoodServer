var request = require('supertest')(url);
var quiz
describe("Quiz Controller", function() {
    it("Create quiz", function(done) {
        var req = request.post("q/createQuiz");
        req.set('Authorization', authorizationHeader);
        req.send({
            quiz: {
                quiz: "Quiz For Unit Test"
            },
            questions: [{
                question: "Test working"
            }, {
                question: "Test Not Working"
            }]
        })
        req.end(function(err, res) {
            if (err) throw err;

            quiz = JSON.parse(res.text);

            done()
        })
    }), it("Update Quiz", function(done) {
        var req = request.post("q/updateQuiz");
        req.set('Authorization', authorizationHeader);
        req.send({
            quiz: quiz,
            questions: [{
                "id": 1,
                "question": "Test working"
            }, {
                "id": 2,
                "question": "Test sdfsdfsdfsfdsdfsf sdfsdfdgdfgdfgdsf"
            }]
        })
        req.end(function(err, res) {
            if (err) throw err;
            JSON.parse(res.text)
            done()
        })
    }), it("Delete Quiz", function(done) {
        var req = request.post("q/deleteQuiz");
        req.set('Authorization', authorizationHeader);
        req.send({
            "id": quiz.id
        })
        req.end(function(err, res) {
            if (err) throw err;
            JSON.parse(res.text)
            done()
        })
    })
})