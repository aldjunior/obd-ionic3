import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Graphs } from './graphDefs';

var btOBDReader;
declare var require: any

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  graphs: any;

  constructor(
    public navCtrl: NavController,
    public plt: Platform
    ) {
    this.graphs = new Graphs();
    var OBDReader = require('bluetooth-obd');
    btOBDReader = new OBDReader();
    var instance = this;

    // set up handlers one time
    btOBDReader.on('debug', function (data) {
      console.log("=>APP DEBUG:" + data)
    });

    btOBDReader.on('error', function (data) {
      console.log("=>APP ERROR:" + data)
    });

    btOBDReader.on('connected', function () {
      console.log("=>APP: Connected");
      this.stopPolling();
      this.removeAllPollers();
      this.addPoller("vss"); // 0,220 mph
      this.addPoller("temp"); // -40,215 C
      this.addPoller("rpm"); // 0, 5178
      this.addPoller("load_pct"); // 0,100%
      this.addPoller("map");// 0,255 kPa
      this.addPoller("frp"); // fuel pressure , 0,765 kPa
      console.log("=======>ON START WE HAVE " + this.getNumPollers() + " pollers");
      this.startPolling(1000); //Request  values every 2 second.
    }); // conneceted
    // constructor

    btOBDReader.on('dataReceived', function (data) {
      console.log(data);
      // dataReceivedMarker = data;
  });

  }

  start() {
    // console.log(this.host);
    this.plt.ready().then(() => {
      console.log("Platform ready, instantiating OBD");
      // wifiOBDReader.setProtocol(0);
      btOBDReader.autoconnect('obd');
    }); // ready
  }

}
