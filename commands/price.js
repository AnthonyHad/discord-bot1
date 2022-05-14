const { SlashCommandBuilder } = require('@discordjs/builders');
const cryptoData = require('../priceScript');
const { MessageEmbed } = require('discord.js');

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
    const data = await cryptoData.getPrice(crypto);
    const cryptoEmbed = new MessageEmbed()
      .setTitle(`${cryptoName[0].toUpperCase() + crypto.substr(1)}`)
      .setDescription('Market data')
      .setColor('#01234')
      .setThumbnail(
        'https://raw.githubusercontent.com/condacore/cryptocurrency-icons/master/32x32/bitcoin.png '
      )
      .addFields(
        {
          name: 'Price',
          value: data[cryptoName].usd,
          inline: true,
        },
        { name: '\u200B', value: '\u200B', inline: true },
        {
          name: 'Market Cap',
          value: data[cryptoName].usd_market_cap,
          inline: true,
        },
        { name: '\u200B', value: '\u200B' },
        {
          name: 'Volume(24h)',
          value: data[cryptoName].usd_24h_vol,
          inline: true,
        },
        { name: '\u200B', value: '\u200B', inline: true },
        {
          name: 'Change(24h)',
          value: data[cryptoName].usd_24h_change,
          inline: true,
        }
      );
    await interaction.reply({
      embeds: [cryptoEmbed],
    });
  },
};

//Old interaction using message replies
//  async execute(interaction) {
//     const crypto = interaction.options.getString('crypto');
//     const cryptoName = interaction.options.get('crypto').value;
//     // const image = path.join(__dirname, '../Bitcoin-Emblem.png');
//     const data = await cryptoData.getPrice(crypto);
//     const message = await interaction.reply({
//       embeds: [this.cryptoEmbed],
//       // content: `${
//       //   cryptoName[0].toUpperCase() + crypto.substr(1)
//       // } is trading at ${data[cryptoName].usd} with ${
//       //   data[cryptoName].usd_24h_change
//       // } change over the past 24h`,
//       // // files: [image],
//       // fetchReply: true,
//     });
//     message.react('972953809959657572');
