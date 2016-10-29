# An XMPP websocket client plugin for Nativescript


## Installation
`tns install nativescript-xmpp-client`



## Usage

```import {Client} from "nativescript-xmpp-client";

   ......
   
       var client = new Client({
               websocket: {url: 'ws://127.0.0.1:5280'},
               jid: 'client2@127.0.0.1',
               password: 'secret'
           });
           
       client.on('online', function (data) {
           //Request roaster
           client1.send(new IQ({from: data.jid, type: 'get', id: 'rand'}).c('query', {xmlns: 'jabber:iq:roster'}));
           //Send a message
           client1.send(new Stanza('message', { to: 'client1@localhost/e35da80401810885bcafbe5bbcafd431' }).c('body').t('HelloWorld'))
       });
       
       client.on('stanza', function (stanza) {
           console.log(stanza.root().toString());
       });
           
       client.on('error', function (error) {
           console.log('client2', error)
       })

```