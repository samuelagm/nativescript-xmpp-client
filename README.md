# Your Plugin Name

Add your plugin badges here. See [nativescript-urlhandler](https://github.com/hypery2k/nativescript-urlhandler) for example.

Then describe what's the purpose of your plugin. 

In case you develop UI plugin, this is where you can add some screenshots.

## (Optional) Prerequisites / Requirements

Describe the prerequisites that the user need to have installed before using your plugin. See [nativescript-firebase plugin](https://github.com/eddyverbruggen/nativescript-plugin-firebase) for example.

## Installation
`tns install nativescript-xmpp-client`



## Usage

``` ts
import {Client, IQ} from "nativescript-xmpp-client";

....
   
 const client = new Client({
    websocket: {url: 'ws://127.0.0.1:5280'},
    jid: 'client2@127.0.0.1',
    password: 'secret'
 });

 client.on('online', function (data) {
    //Request roaster
    client.send(new IQ({from: data.jid, type: 'get', id: 'rand'}).c('query', {xmlns: 'jabber:iq:roster'}));
 });

 client.on('stanza', function (stanza) {
    console.log(stanza.root().toString());
 });

 client.on('error', function (error) {
    console.log('client2', error)
 })

```

## Improvements
Please feel free to send in PRs, Thanks
