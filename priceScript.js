const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

async function getPrice(coin) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
  );
  const data = await response.json();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(data[coin].usd);
}

module.exports = {
  getPrice,
};
