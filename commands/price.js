const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const cryptoData = require('../priceScript');
const path = require('path');

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
    // const image = path.join(__dirname, '../Bitcoin-Emblem.png');
    const data = await cryptoData.getPrice(crypto);
    const message = await interaction.reply({
      content: `${
        cryptoName[0].toUpperCase() + crypto.substr(1)
      } is trading at ${data[cryptoName].usd} with ${
        data[cryptoName].usd_24h_change
      } change over the past 24h`,
      // files: [image],
      fetchReply: true,
    });
    message.react('972953809959657572');
  },
};
