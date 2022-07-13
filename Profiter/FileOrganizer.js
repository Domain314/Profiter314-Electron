const settings = require('electron-settings');
const {ipcMain} = require('electron');

var fs = require('fs');
var path = require('path');

function buildDatePrefix() {
  let date = new Date();
  return (
    date.getHours() + "-" +
    date.getMinutes() + "-" +
    date.getSeconds() + "-"
  );
}

function saveCSV(name, content, directory) {
  let dir = __dirname.split("Profiter")[0] + directory;
  let p, con, flag = "w";

  if (name[0] === '_') {
    p = path.join(dir, '.', name +  ".csv");
    flag = "a";
    if (!fs.existsSync(directory + name + ".csv")) {
      console.log("exists");
      let temp = content;
      content = "Days,Sold,NEAR,EUR,Total-NEAR,\n" + temp;
    }
    console.log("name0: ");

  } else {
    p = path.join(dir, '.', buildDatePrefix() + name +  ".csv");
  }

  if (typeof content === "object") {
    for (var i = 0; i < content.length; i++) {
      con += content[i];
    }
  } else {
    con = content;
  }
  console.log(con);
  fs.writeFile(p, con, {flag: flag},(err) => {
    if (err) {
        console.log("An error ocurred updating the file" + err.message);
        console.log(err);
        return;
    }

    console.log("The file " + name + " has been succesfully saved.");
    console.log(p);
});
}


function setConfig() {
  settings.configure({prettify: true});
  settings.setSync('General', {
    mode: 'ggg',
    days: 30,
    Stock_Save_Path: "RESULT_GEN/RandomStock.csv",
    Musician_Save_Path: "RESULT_GEN/RandomMusicians.csv",
    Client_Save_Path: "RESULT_GEN/RandomClients.csv",
  });
  settings.setSync('B_Side', {
    Capital_EUR: 0.0,
    Capital_NEAR: 500.0,
    Max_Exchange_Per_Hour: 500.0,
    BSide_Cut: 0.05,
    Exchange_Fee: 0.1
  });
  settings.setSync('Random_Stock', {
    Start_Price: 5.0,
    End_Price: 5.0,
    Stock_Fluctuation: 2.0
  });
  settings.setSync('Random_Musician', {
    Amount_Musician: 200,
    Amount_Musician_Fluctuation: 0,
    Days_Between_Releases: 20,
    Days_Between_Releases_Fluctuation: 10,
    NFTs_Per_Release: 20,
    NFTs_Per_Release_Fluctuation: 10,
    Sell_Price: 10.0,
    Sell_Price_Fluctuation: 5.0,
    Popularity: 0.8,
    Popularity_Fluctuation: 0.4,
    Krypto_Acceptance_Musician: 0.4,
    Krypto_Acceptance_Musician_Fluctuation: 0.4
  });
  settings.setSync('Random_Client', {
    Amount_Client: 5000,
    Amount_Client_Fluctuation: 0,
    Capital_Client: 100.0,
    Capital_Client_Fluctuation: 80.0,
    Buy_Motivation: 0.005,
    Buy_Motivation_Fluctuation: 0.005,
    Resell_Motivation: 0.0025,
    Resell_Motivation_Fluctuation: 0.0025,
    Loyalty: 0.1,
    Loyalty_Fluctuation: 0.05,
    Krypto_Acceptance_Client: 0.3,
    Krypto_Acceptance_Client_Fluctuation: 0.3,
    Musicians_Per_Day: 20,
    Musicians_Per_Day_Fluctuation: 19
  });
}

function loadSettings() {
  if (settings.hasSync(['General'])) {
    console.log("Config found.\nLoading settings..");
  } else {
    console.log("Config not found.\nGenerating default settings..");
    setConfig();
    console.log("Settings: default");
  }

  // ipcMain.send('settings:get', {
  //   config: JSON.stringify(settings.getSync())
  // });
}

module.exports = {
  initializeSettings: function () {
    loadSettings();
  },
  saveCSV: function (name, content, directory) {
    saveCSV(name, content, directory);
  }
}
