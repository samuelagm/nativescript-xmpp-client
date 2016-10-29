import * as observable from "data/observable";
import * as pages from "ui/page";
import {HelloWorldModel} from "./main-view-model";
import {Client} from "nativescript-xmpp-client";
import {Stanza} from "nativescript-xmpp-client";
import {IQ} from "nativescript-xmpp-client";

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();
    var client1 = new Client({
        websocket: {url: 'ws://192.168.43.220:5280'},
        jid: 'client2@192.168.43.220',
        password: 'secret'
    });

    client1.on('online', function (data) {
        console.dir(data);
        let iq = new IQ({from: data.jid, type: 'get', id: 'rand'}).c('query', {xmlns: 'jabber:iq:roster'});
        console.log(iq.root().toString());
        client1.send(iq);
        client1.send(new Stanza('message', { to: 'client1@localhost/e35da80401810885bcafbe5bbcafd431' }).c('body').t('HelloWorld'))
    });

    client1.on('stanza', function (stanza) {
        console.log(stanza.root().toString());
    });

    client1.on('error', function (error) {
        console.log('client2', error)
    })
}