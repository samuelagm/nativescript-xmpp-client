import * as observable from "data/observable";
import * as observableArray from "data/observable-array";
import * as pages from "ui/page";
import {Client} from "nativescript-xmpp-client";
import {Stanza} from "nativescript-xmpp-client";
import {IQ} from "nativescript-xmpp-client";
import listViewModule = require("ui/list-view");

class MainPage {

    private model: Observable;
    private selectedJID: string;
    private clientInstance: any;
    private connected: boolean;

    pageLoaded = (args: observable.EventData) => {
        // Get the event sender
        let page = <pages.Page>args.object;
        this.model = new observable.Observable({"connected": false, message: "", serverAddress: "192.168.8.102"});
        //let jids = new observableArray.ObservableArray([{client:"meow", fullJID:"meow@gg.com"}]);
        let jids = new observableArray.ObservableArray();
        let messages = new observableArray.ObservableArray();
        this.model.set("jids", jids);
        this.model.set("messages", messages);
        page.bindingContext = this.model;
    }

    registerClient = (serverAddress: string) => {
        let id = Math.random() * (100000 - 1) + 1;

        this.clientInstance = new Client({
            websocket: {url: `ws://${serverAddress}:5280`},
            jid: `client${id}@${serverAddress}`,
            password: 'secret'
        });

        this.clientInstance.on('online', (data) => {
            this.connected = true;
            this.model.set("connected", true);
            let iq = new IQ({from: data.jid, type: 'get', id: 'rand'}).c('query', {xmlns: 'jabber:iq:roster'});
            this.clientInstance.send(iq);
        });

        this.clientInstance.on('stanza', (stanza) => {
            if (stanza.is("iq")) {
                let jsonStanza = stanza.toJSON();
                if (typeof jsonStanza.children[0].children[0] !== 'undefined') {
                    let jid = jsonStanza.children[0].children[0].attrs.jid;
                    this.model.get("jids").push(jid);
                    console.log(jid);
                }
            } else if (stanza.is("message")) {
                let jsonStanza = stanza.toJSON();
                console.dir(jsonStanza);
                this.selectedJID = jsonStanza.attrs.from
                this.model.get("messages").push(jsonStanza.children[0].children[0])
            }
        });

        this.clientInstance.on('error', (error) => {
            console.log('client2', error);
            console.dir(error);
        })
    }

    onItemTap = (args: listViewModule.ItemEventData) => {
        listViewModule.ListView.se
        let jids = this.model.get("jids");
        console.dir(jids._array);
        this.selectedJID = jids._array[args.index];
    }

    connect = (args: observable.EventData) => {
        if (!this.connected) {
            let page = <pages.Page>args.object;
            let address = page.bindingContext.get("serverAddress");
            this.registerClient(address);
        }
    }

    sendMessage = (args: observable.EventData) => {
        console.log(this.selectedJID);
        this.model.get("messages").push(this.model.get("message"));
        this.clientInstance.send(new Stanza('message', {to: this.selectedJID})
            .c('body')
            .t(this.model.get("message")));
        this.model.set("message", "");
        let page = <pages.Page>args.object;
        let messageList = <listViewModule.ListView>page.getViewById("messageList");
        messageList.scrollToIndex(this.model.get("jids")._array.length);
    }
}

export = new MainPage();