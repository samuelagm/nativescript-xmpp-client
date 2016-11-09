import * as observable from "data/observable";
import * as observableArray from "data/observable-array";
import * as pages from "ui/page";
import {Client} from "nativescript-xmpp-client";
import {Stanza} from "nativescript-xmpp-client";
import {IQ} from "nativescript-xmpp-client";


class MainPage {

    private model: Observable
    pageLoaded = (args: observable.EventData) => {
        // Get the event sender
        let page = <pages.Page>args.object;
        this.model = new observable.Observable();
        //let jids = new observableArray.ObservableArray([{client:"meow", fullJID:"meow@gg.com"}]);
        let jids = new observableArray.ObservableArray();
        this.model.set("jids", jids);
        page.bindingContext = this.model;
    }

    registerClient = (serverAddress: string) => {
        var client1 = new Client({
            websocket: {url: `ws://${serverAddress}:5280`},
            jid: `client2@${serverAddress}`,
            password: 'secret'
        });

        client1.on('online', (data) => {
            //console.dir(data);
            let iq = new IQ({from: data.jid, type: 'get', id: 'rand'}).c('query', {xmlns: 'jabber:iq:roster'});
            //console.log(iq.root().toString());
            client1.send(iq);
            //client1.send(new Stanza('message', { to: 'client1@localhost/e35da80401810885bcafbe5bbcafd431' }).c('body').t('HelloWorld'))
        });

        client1.on('stanza', (stanza) => {
            if (stanza.is("iq")) {
                let jsonStanza = stanza.toJSON();
                if (typeof jsonStanza.children[0].children[0] !== 'undefined') {
                    let jid = jsonStanza.children[0].children[0].attrs.jid;
                    this.model.get("jids").push(jid);
                    console.log(jid);
                }
            }
        });

        client1.on('error', (error) => {
            console.log('client2', error);
            console.dir(error);
        })
    }

    listViewItemTap = (args) => {

    }

    connect = (args: observable.EventData) => {
        let page = <pages.Page>args.object;
        let address = page.bindingContext.get("serverAddress");
        console.dir(address);
        this.registerClient(address);
    }
}

export = new MainPage();