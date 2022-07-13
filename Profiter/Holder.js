const settings = require('electron-settings');

var Days = new Array();
var Musicians = new Array();
var Clients = new Array();

const Generator = require('./Generator');


function generateMarket() {
  // check if mode == "ggg"
  Days = Generator.genDays();
  Musicians = Generator.genMusicians();
  Clients = Generator.genClients();
}


module.exports = {
  generateMarket: function () {
    generateMarket
    ();
  },
  Days: function() {
    return Days;
  },
  Musicians: function() {
    return Musicians;
  },
  Clients: function() {
    return Clients;
  }
}
