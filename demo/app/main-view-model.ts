import { Observable } from 'tns-core-modules/data/observable';
import { XmppClient } from 'nativescript-xmpp-client';

export class HelloWorldModel extends Observable {
  public message: string;
  private xmppClient: XmppClient;

  constructor() {
    super();

    this.xmppClient = new XmppClient();
    this.message = this.xmppClient.message;
  }
}
