const { SlashCommandBuilder } = require('@discordjs/builders');
const cryptoData = require('../priceScript');

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
    const price = await cryptoData.getPrice(crypto);
    await interaction.reply(
      `${
        cryptoName[0].toUpperCase() + crypto.substr(1)
      } is trading at ${price.toString()}`
    );
  },
};
