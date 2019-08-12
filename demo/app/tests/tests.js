var XmppClient = require("nativescript-xmpp-client").XmppClient;
var xmppClient = new XmppClient();

describe("greet function", function() {
    it("exists", function() {
        expect(xmppClient.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(xmppClient.greet()).toEqual("Hello, NS");
    });
});