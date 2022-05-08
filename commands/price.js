const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Gets crypto price data!')
    .addStringOption((option) =>
      option
        .setName('crypto')
        .setDescription('Will get you the latest data on these assets!')
        .setRequired(true)
        .addChoices(
          {
            name: 'Bitcoin',
            value: 'bitcoin',
          },
          {
            name: 'Ethereum',
            value: 'ethereum',
          }
        )
    ),
  async execute(interaction) {
    const crypto = interaction.options.getString('crypto');
    const cryptoName = interaction.options.get('crypto').value;
    console.log(cryptoName);
    const price = await getPrice(crypto);
    await interaction.reply(
      `${
        cryptoName[0].toUpperCase() + crypto.substr(1)
      } is trading at ${price.toString()}`
    );
  },
};

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