var expect = require('chai').expect;
var index = require('../index');
 
const context = require('aws-lambda-mock-context');
const ctx = context();
 
describe("Testing a session with the NetflixBrowserIntent", function() {
    var speechResponse = null
    var speechError = null
 
    before(function(done){
        index.handler({
                        "session": {
                            "sessionId": "SessionId.445e1135-a0ec-4aff-a1e0-4bfd73d24f85",
                            "application": {
                            "applicationId": "amzn1.ask.skill.9008ab73-c853-40e8-81bf-2e0de5f24865"
                            },
                            "attributes": {},
                            "user": {
                            "userId": ""
                            },
                            "new": true
                        },
                        "request": {
                            "type": "IntentRequest",
                            "requestId": "EdwRequestId.cdfb8be8-d8fd-4771-b2ef-25c4a6bdec08",
                            "locale": "en-US",
                            "timestamp": "2016-11-26T16:17:46Z",
                            "intent": {
                            "name": "NetflixBrowserIntent",
                            "slots": {
                                "Actor": {
                                "name": "Actor",
                                "value": "Sharon%20Stone"
                                }
                            }
                            }
                        },
                        "version": "1.0"
                        }, ctx)
 
        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })
 
    describe("The response is structurally correct for Alexa Speech Services", function() {
        it('should not have errored',function() {
            expect(speechError).to.be.null
        })
 
        it('should have a version', function() {
            console.log(speechResponse.response.card.content);
            expect(speechResponse.version).not.to.be.null
        })
 
        it('should have a speechlet response', function() {
            expect(speechResponse.response).not.to.be.null
        })
 
        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })
 
        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})
