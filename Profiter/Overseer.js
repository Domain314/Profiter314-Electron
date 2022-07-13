const FileOrganizer = require('./FileOrganizer');
const Holder = require('./Holder');
const Simulator = require('./Simulator');
const Former = require('./Former');

function initialize() {
  FileOrganizer.initializeSettings();
  // Former.initializeForm();
}

function generate(settings) {
  console.log(settings);
  Former.recieveForm(settings);
  Holder.generateMarket();
  Simulator.simulate();
}

function simulate() {
  Holder.generateMarket();
  Simulator.simulate();
}

module.exports = {
  initialize: function () {
    initialize();
  },
  setConfig: function (settings) {
    generate(settings);
  },
  simulate: function () {
    simulate();
  }
}
