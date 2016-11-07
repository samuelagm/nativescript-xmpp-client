import * as observable from "data/observable";
import * as pages from "ui/page";
import {Client} from "nativescript-xmpp-client";
import {Stanza} from "nativescript-xmpp-client";
import {IQ} from "nativescript-xmpp-client";

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    let model = new observable.Observable();
    page.bindingContext = model;
}

function registerClient(serverAddress:string){
    var client1 = new Client({
        websocket: {url: `ws://${serverAddress}:5280`},
        jid: `client2@${serverAddress}`,
        password: 'secret'
    });

    client1.on('online', function (data) {
        //console.dir(data);
        let iq = new IQ({from: data.jid, type: 'get', id: 'rand'}).c('query', {xmlns: 'jabber:iq:roster'});
        //console.log(iq.root().toString());
        client1.send(iq);
        //client1.send(new Stanza('message', { to: 'client1@localhost/e35da80401810885bcafbe5bbcafd431' }).c('body').t('HelloWorld'))
    });

    client1.on('stanza', function (stanza) {
        if(stanza.is("iq") ){
            let jsonStanza = stanza.toJSON();
            console.dir(jsonStanza.children[0].children[0]);
        }
        //console.log(stanza.root().toString());
    });

    client1.on('error', function (error) {
        console.log('client2', error);
        console.dir(error);
    })
}

export function connect(args: observable.EventData){
    let page = <pages.Page>args.object;
    let address = page.bindingContext.get("serverAddress");
    console.dir(address);
    registerClient(address);

}