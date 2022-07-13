const settings = require('electron-settings');
const Holder = require('./Holder');
const FileOrganizer = require('./FileOrganizer');

var BSide;
var daysSim = settings.getSync("General.days");

var sortedClients = new Array();
for (var i = 0; i < 24; i++) {
  sortedClients.push(new Array());
}

function prepareSimulation() {
  for (var i = 0; i < Holder.Clients().length; i++) {
    let index = Holder.Clients()[i].Daytime_To_Check;
    sortedClients[index].push(Holder.Clients()[i]);
  }
  let bside_settings = settings.getSync("B_Side");
  BSide = {
    Capital_EUR: bside_settings.Capital_EUR,
    Capital_NEAR: bside_settings.Capital_NEAR,
    Max_Exchange_Per_Hour: bside_settings.Max_Exchange_Per_Hour,
    BSide_Cut: bside_settings.BSide_Cut,
    Exchange_Fee: bside_settings.Exchange_Fee,
    Credit_History_EUR: new Array(),
    Credit_History_NEAR: new Array(),
    NFTs_Sold: new Array()
  }
}

function checkMusicianRelease() {
  for (var i = 0; i < Holder.Musicians().length; i++) {
    let musician = Holder.Musicians()[i];
    if (musician.Days_Until_Next_Release <= 0) {
      musician.Days_Until_Next_Release = musician.Days_Between_Releases;
      for (var j = 0; j < musician.NFTs_Per_Release; j++) {
        musician.Wallet.push({
          id: 1234,
          Value: musician.Sell_Price,
          Owner_Name: musician.Band_Name,
          Band_id: musician.id,
          Band_Name: musician.Band_Name,
          History: new Array()
        });
      }
    } else {
      musician.Days_Until_Next_Release -= 1;
    }

  }
}

function checkBuyMotivation(client, musician) {

  if (musician.Wallet.length == 0) {
    return false;
  }

  let price = client.Krypto_Acceptance ?
  musician.Sell_Price :
  musician.Sell_Price * (1.0 + BSide.Exchange_Fee);
  if (client.Capital < price) {
    return false;
  }

  let chance = client.Buy_Motivation * musician.Popularity;
  let rnd = Math.random();
  if (chance < rnd) {
    return false;
  }

  return true;
}

function makeTransaction(client, musician, day) {
  let stockPrice = Holder.Days()[client.Daytime_To_Check];
  let nft = musician.Wallet.pop();

  let nftPrice = nft.Value;
  let clientPrice = nftPrice;
  let musicianPrice = nftPrice * (1.0 - BSide.BSide_Cut);
  BSide.Capital_NEAR += nftPrice * BSide.BSide_Cut;
  BSide.Credit_History_NEAR.push(day + ",Cut,+" + (nftPrice * BSide.BSide_Cut) + ",\n");

  if (!client.Krypto_Acceptance) {
    clientPrice *= (1.0 + BSide.Exchange_Fee);
    BSide.Capital_EUR += nftPrice * stockPrice;
    BSide.Credit_History_EUR.push(day + ",CEx,+" + (clientPrice * stockPrice) + ",\n");
  } else {
    BSide.Capital_NEAR += nftPrice;
    BSide.Credit_History_NEAR.push(day + ",CBuy,+" + clientPrice + ",\n");
  }
  if (!musician.Krypto_Acceptance) {
    musicianPrice -= (nftPrice * BSide.Exchange_Fee)
    BSide.Capital_EUR -= (musicianPrice * stockPrice);
    BSide.Credit_History_EUR.push(day + ",MEx,-" + (musicianPrice * stockPrice) + ",\n");
    musician.Credit_History.push(
      day + "," +
      musicianPrice + "," +
      (musicianPrice * stockPrice) +
      ",\n"
    );
  } else {
    BSide.Capital_NEAR -= musicianPrice;
    BSide.Credit_History_NEAR.push(day + ",MSell,-" + musicianPrice + ",\n");
    musician.Credit_History.push(
      day + "," +
      musicianPrice + "," +
      musicianPrice +
      ",\n"
    );
  }

  client.Capital -= clientPrice;
  client.Credit_History.push(day + ",Buy," + nft.id + "," + clientPrice + ",\n");
  client.Wallet.push(nft);

  nft.Owner_Name = client.Client_Name;
  nft.History.push(day + ",Sold," + client.Client_Name + ",\n");
  let bill =
    day + "," +
    nft.id + "," +
    nft.Band_Name + "," +
    (musician.Krypto_Acceptance ? "ja" : "nein") + "," +
    nft.Owner_Name + "," +
    (client.Krypto_Acceptance ? "ja" : "nein") + "," +
    nftPrice + "," +
    clientPrice + "," +
    musicianPrice + "," +
    (clientPrice - musicianPrice) + ",\n";
  BSide.NFTs_Sold.push(bill);
}

function clientAction(client, day) {

  for (var i = 0; i < client.Musicians_Per_Day; i++) {
    let rnd =
      Math.floor(Math.random() * Holder.Musicians().length) %
      Holder.Musicians().length;
    let musician = Holder.Musicians()[rnd];

    if (checkBuyMotivation(client, musician)) {
      makeTransaction(client, musician, day);
    }
  }
}

function simulate() {
  let stockPrice = Holder.Days()[0];

  console.log(BSide);

  for (var i = 0; i < daysSim; i++) {
    checkMusicianRelease();
    for (var j = 0; j < 24; j++) {
      for (var k = 0; k < sortedClients[j].length; k++) {
        clientAction(sortedClients[j][k], i);
      }

    }
    bSideBuyNear(stockPrice);
  }
  // console.log(BSide);
  let result =
    daysSim + "," +
    BSide.NFTs_Sold.length + "," +
    BSide.Capital_NEAR + "," +
    BSide.Capital_EUR + "," +
    (BSide.Capital_NEAR + (BSide.Capital_EUR / 5.0)) + ",\n";
  console.log(result);
  FileOrganizer.saveCSV("Capital_EUR", BSide.Credit_History_EUR, "RESULT_SIM/");
  FileOrganizer.saveCSV("Capital_NEAR", BSide.Credit_History_NEAR, "RESULT_SIM/");
  FileOrganizer.saveCSV("NFTs_SOLD", BSide.NFTs_Sold, "RESULT_SIM/");

  FileOrganizer.saveCSV("_ALL_Simulations", result, "RESULT_SIM/");
}

function bSideBuyNear(stockPrice) {
  if (BSide.Capital_NEAR < BSide.Max_Exchange_Per_Hour/5.0) {
    let eur = BSide.Max_Exchange_Per_Hour * stockPrice;
    BSide.Capital_EUR -= eur;
    BSide.Capital_NEAR += BSide.Max_Exchange_Per_Hour;
  }
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
  simulate: function () {
    prepareSimulation();
    simulate();
  }
}
