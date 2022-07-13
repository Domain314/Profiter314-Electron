const settings = require('electron-settings');
const FileOrganizer = require('./FileOrganizer');

var StockCSV = "";
var MusiciansCSV = "ID,Days Between Releases,NFT per Release,Sell Price,Popularity %,Krypto Love,\n";
var ClientsCSV = "ID,Capital,Buy Motivation %,Resell Motivation %,Loyalty %,Musicians per Day,Daytime,Krypto Love,\n";

function genDays() {
  let Days = new Array();
  let daysAmount = settings.getSync('General.days');
  let random_stock = settings.getSync('Random_Stock');
  for (var i = 0; i < daysAmount; i++) {
    for (var j = 0; j < 24; j++) {
      let rnd = randn_bm(
        random_stock.Start_Price - random_stock.Stock_Fluctuation,
        random_stock.Start_Price + random_stock.Stock_Fluctuation
      )
      Days.push(rnd);
      StockCSV += rnd + ",\n";
    }
  }
  FileOrganizer.saveCSV("Stock", StockCSV, "RESULT_GEN/");
  return Days;
}

function genMusicians() {
  let Musicians = new Array();
  let random_musicians = settings.getSync('Random_Musician');
  let daysBetweenReleases = new Array();
  let nftsPerRelease = new Array();
  let sellPrice = new Array();
  let popularity = new Array();
  let kryptoAcceptance = new Array();
  for (var i = 0; i < random_musicians.Amount_Musician; i++) {
    daysBetweenReleases.push(Math.floor(randn_bm(
      random_musicians.Days_Between_Releases -
      random_musicians.Days_Between_Releases_Fluctuation*2.0,
      random_musicians.Days_Between_Releases +
      random_musicians.Days_Between_Releases_Fluctuation*2.0
    )));
    nftsPerRelease.push(Math.abs(Math.floor(randn_bm(
      random_musicians.NFTs_Per_Release -
      random_musicians.NFTs_Per_Release_Fluctuation*2.0,
      random_musicians.NFTs_Per_Release +
      random_musicians.NFTs_Per_Release_Fluctuation*2.0
    ))));
    sellPrice.push(Math.abs(randn_bm(
      random_musicians.Sell_Price -
      random_musicians.Sell_Price_Fluctuation*2.0,
      random_musicians.Sell_Price +
      random_musicians.Sell_Price_Fluctuation*2.0
    )));
    popularity.push(randn_bm(
      random_musicians.Popularity -
      random_musicians.Popularity_Fluctuation*2.0,
      random_musicians.Popularity +
      random_musicians.Popularity_Fluctuation*2.0
    ));
    let rnd = randn_bm(
      random_musicians.Krypto_Acceptance_Musician -
      random_musicians.Krypto_Acceptance_Musician_Fluctuation*2.0,
      random_musicians.Krypto_Acceptance_Musician +
      random_musicians.Krypto_Acceptance_Musician_Fluctuation*2.0
    );
    kryptoAcceptance.push(Math.random() < rnd ? true : false);
  }
  for (var i = 0; i < random_musicians.Amount_Musician; i++) {
    let id = Math.floor(Math.random()*10000000);
    Musicians.push({
      id: id,
      Band_Name: "test1",
      Days_Between_Releases: daysBetweenReleases[i],
      Days_Until_Next_Release: 0,
      NFTs_Per_Release: nftsPerRelease[i],
      Sell_Price: sellPrice[i],
      Popularity: popularity[i],
      Krypto_Acceptance: kryptoAcceptance[i],
      Credit_History: new Array(),
      Wallet: new Array()
    });
    MusiciansCSV += String(
      id + "," +
      daysBetweenReleases[i] + "," +
      nftsPerRelease[i] + "," +
      Math.round(sellPrice[i]*10000)/10000.0 + "," +
      Math.round(popularity[i]*10000)/100.0 + "," +
      (kryptoAcceptance[i] ? "ja" : "nein") + ",\n"
    );
  }
  FileOrganizer.saveCSV("Musicians_before", MusiciansCSV,"RESULT_GEN/");
  return Musicians;
}

function genClients() {
  var Clients = new Array();
  let random_clients = settings.getSync('Random_Client');
  let capital = new Array();
  let buyMotivation = new Array();
  let resellMotivation = new Array();
  let loyalty = new Array();
  let musiciansPerDay = new Array();
  let daytimeToCheck = new Array();
  kryptoAcceptance = new Array();
  for (var i = 0; i < random_clients.Amount_Client; i++) {
    capital.push(randn_bm(
      random_clients.Capital_Client -
      random_clients.Capital_Client_Fluctuation*2.0,
      random_clients.Capital_Client +
      random_clients.Capital_Client_Fluctuation*2.0
    ));
    buyMotivation.push(Math.abs(randn_bm(
      random_clients.Buy_Motivation -
      random_clients.Buy_Motivation_Fluctuation*2.0,
      random_clients.Buy_Motivation +
      random_clients.Buy_Motivation_Fluctuation*2.0
    )));
    resellMotivation.push(Math.abs(randn_bm(
      random_clients.Resell_Motivation -
      random_clients.Resell_Motivation_Fluctuation*2.0,
      random_clients.Resell_Motivation +
      random_clients.Resell_Motivation_Fluctuation*2.0
    )));
    loyalty.push(Math.abs(randn_bm(
      random_clients.Loyalty -
      random_clients.Loyalty_Fluctuation*2.0,
      random_clients.Loyalty +
      random_clients.Loyalty_Fluctuation*2.0
    )));
    musiciansPerDay.push(Math.abs(Math.floor(randn_bm(
      random_clients.Musicians_Per_Day -
      random_clients.Musicians_Per_Day_Fluctuation*2.0,
      random_clients.Musicians_Per_Day +
      random_clients.Musicians_Per_Day_Fluctuation*2.0
    ))));
    daytimeToCheck.push(Math.floor(randn_bm(0, 32))%24);
    let rnd = randn_bm(
      random_clients.Krypto_Acceptance_Client -
      random_clients.Krypto_Acceptance_Client_Fluctuation*2.0,
      random_clients.Krypto_Acceptance_Client +
      random_clients.Krypto_Acceptance_Client_Fluctuation*2.0
    );
    kryptoAcceptance.push(Math.random() < rnd ? true : false);
  }
  for (var i = 0; i < random_clients.Amount_Client; i++) {
    let id = Math.floor(Math.random()*1000000);
    while (id < 1000000) id *= 10;
    Clients.push({
      id: id,
      Client_Name: "test1",
      Capital: capital[i],
      Buy_Motivation: buyMotivation[i],
      Resell_Motivation: resellMotivation[i],
      Loyalty: loyalty[i],
      Musicians_Per_Day: musiciansPerDay[i],
      Daytime_To_Check: daytimeToCheck[i],
      Krypto_Acceptance: kryptoAcceptance[i],
      Credit_History: new Array(),
      Wallet: new Array()
    });
    ClientsCSV += String(
      id + "," +
      Math.round(capital[i]*10000)/10000.0 + "," +
      Math.round(buyMotivation[i]*100000)/1000.0 + "," +
      Math.round(resellMotivation[i]*100000)/1000.0 + "," +
      Math.round(loyalty[i]*10000)/100.0 + "," +
      musiciansPerDay[i] + "," +
      daytimeToCheck[i] + "," +
      (kryptoAcceptance[i] ? "ja" : "nein") + ",\n"
    );
  }
  FileOrganizer.saveCSV("Clients_before", ClientsCSV, "RESULT_GEN/");
  return Clients;
}

const randn_bm = (min, max) => {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max); // resample between 0 and 1 if out of range
    // num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}

module.exports = {
  genDays: function () {
    return genDays();
  },
  genMusicians: function () {
    return genMusicians();
  },
  genClients: function () {
    return genClients();
  },
}
