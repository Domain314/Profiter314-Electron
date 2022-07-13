const Overseer = require('./Overseer');
const electron = require('electron');
const {ipcRenderer} = require('electron');
const settings = require('electron-settings');

function recieveForm(conf){
  let config = JSON.parse(conf.config)

  console.log("recieveForm");

  if (config.g_days != "") {
    settings.setSync('General.days', parseInt(config.g_days));
  }
  if (config.s_start != "") {
    settings.setSync('Random_Stock.Start_Price', parseFloat(config.s_start));
  }
  if (config.s_end != "") {
    settings.setSync('Random_Stock.End_Price', parseFloat(config.s_end));
  }
  if (config.s_fluc != "") {
    settings.setSync('Random_Stock.Stock_Fluctuation', parseFloat(config.s_fluc));
  }

  if (config.b_eur != "") {
    settings.setSync('B_Side.Capital_EUR', parseFloat(config.b_eur));
  }
  if (config.b_near != "") {
    settings.setSync('B_Side.Capital_NEAR', parseFloat(config.b_near));
  }
  if (config.b_max_exchange != "") {
    settings.setSync('B_Side.Max_Exchange_Per_Hour', parseFloat(config.b_max_exchange));
  }
  if (config.b_bside_cut != "") {
    settings.setSync('B_Side.BSide_Cut', parseFloat(config.b_bside_cut));
  }
  if (config.b_exchange_fee != "") {
    settings.setSync('B_Side.Exchange_Fee', parseFloat(config.b_exchange_fee));
  }

  if (config.m_amount != "") {
    settings.setSync('Random_Musician.Amount_Musician', parseInt(config.m_amount));
  }
  if (config.m_days_between != "") {
    settings.setSync('Random_Musician.Days_Between_Releases', parseInt(config.m_days_between));
  }
  if (config.m_days_between_fluc != "") {
    settings.setSync('Random_Musician.Days_Between_Releases_Fluctuation', parseInt(config.m_days_between_fluc));
  }
  if (config.m_nfts_per_release != "") {
    settings.setSync('Random_Musician.NFTs_Per_Release', parseInt(config.m_nfts_per_release));
  }
  if (config.m_nfts_per_release_fluc != "") {
    settings.setSync('Random_Musician.NFTs_Per_Release_Fluctuation', parseInt(config.m_nfts_per_release_fluc));
  }
  if (config.m_price_per_nft != "") {
    settings.setSync('Random_Musician.Sell_Price', parseFloat(config.m_price_per_nft));
  }
  if (config.m_price_per_nft_fluc != "") {
    settings.setSync('Random_Musician.Sell_Price_Fluctuation', parseFloat(config.m_price_per_nft_fluc));
  }
  if (config.m_popularity != "") {
    settings.setSync('Random_Musician.Popularity', parseFloat(config.m_popularity));
  }
  if (config.m_popularity_fluc != "") {
    settings.setSync('Random_Musician.Popularity_Fluctuation', parseFloat(config.m_popularity_fluc));
  }
  if (config.m_krypto_accept != "") {
    settings.setSync('Random_Musician.Krypto_Acceptance_Musician', parseFloat(config.m_krypto_accept));
  }
  if (config.m_krypto_accept_fluc != "") {
    settings.setSync('Random_Musician.Krypto_Acceptance_Musician_Fluctuation', parseFloat(config.m_krypto_accept_fluc));
  }

  if (config.c_amount != "") {
    settings.setSync('Random_Client.Amount_Client', parseInt(config.c_amount));
  }
  if (config.c_capital != "") {
    settings.setSync('Random_Client.Capital_Client', parseFloat(config.c_capital));
  }
  if (config.c_capital_fluc != "") {
    settings.setSync('Random_Client.Capital_Client_Fluctuation', parseFloat(config.c_capital_fluc));
  }
  if (config.c_buy_mot != "") {
    settings.setSync('Random_Client.Buy_Motivation', parseFloat(config.c_buy_mot));
  }
  if (config.c_buy_mot_fluc != "") {
    settings.setSync('Random_Client.Buy_Motivation_Fluctuation', parseFloat(config.c_buy_mot_fluc));
  }
  if (config.c_resell_mot != "") {
    settings.setSync('Random_Client.Resell_Motivation', parseFloat(config.c_resell_mot));
  }
  if (config.c_resell_mot_fluc != "") {
    settings.setSync('Random_Client.Resell_Motivation_Fluctuation', parseFloat(config.c_resell_mot_fluc));
  }
  if (config.c_loyalty != "") {
    settings.setSync('Random_Client.Loyalty', parseFloat(config.c_loyalty));
  }
  if (config.c_loyalty_fluc != "") {
    settings.setSync('Random_Client.Loyalty_Fluctuation', parseFloat(config.c_loyalty_fluc));
  }
  if (config.c_krypto_accept != "") {
    settings.setSync('Random_Client.Krypto_Acceptance_Client', parseFloat(config.c_krypto_accept));
  }
  if (config.c_krypto_accept_fluc != "") {
    settings.setSync('Random_Client.Krypto_Acceptance_Client_Fluctuation', parseFloat(config.c_krypto_accept_fluc));
  }
  if (config.c_musicians_per_day != "") {
    settings.setSync('Random_Client.Musicians_Per_Day', parseInt(config.c_musicians_per_day));
  }
  if (config.c_musicians_per_day_fluc != "") {
    settings.setSync('Random_Client.Musicians_Per_Day_Fluctuation', parseInt(config.c_musicians_per_day_fluc));
  }


};

module.exports = {
  recieveForm: function (conf) {
    recieveForm(conf);
  }
}
