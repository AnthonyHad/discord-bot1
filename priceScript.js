const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

async function getPrice(coin) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true
`
  );
  const data = await response.json();
  // console.log(data);
  const formatterCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  data[coin].usd = formatterCurrency.format(Math.round(data[coin].usd));
  data[coin].usd_market_cap = formatterCurrency.format(
    Math.round(parseFloat(data[coin].usd_market_cap))
  );
  data[coin].usd_24h_vol = formatterCurrency.format(
    Math.round(parseFloat(data[coin].usd_24h_vol))
  );
  data[coin].usd_24h_change = `${Math.round(
    parseFloat(data[coin].usd_24h_change)
  )}%`;
  return data;
}

// getPrice('binancecoin').then((res) => console.log(res));
module.exports = {
  getPrice,
};
