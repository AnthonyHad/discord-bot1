const { SlashCommandBuilder } = require('@discordjs/builders');
const cryptoData = require('../priceScript');
const Chart = require('../chartScript');
const QuickChart = require('quickchart-js');
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
          },
          {
            name: 'Binance Coin',
            value: 'binancecoin',
          },
          {
            name: 'Tezos',
            value: 'tezos',
          },
          {
            name: 'Ripple',
            value: 'xrp',
          },
          {
            name: 'Cardano',
            value: 'cardano',
          },
          {
            name: 'Solana',
            value: 'solana',
          },
          {
            name: 'Dogecoin',
            value: 'dogecoin',
          }
        )
    ),

  async execute(interaction) {
    const crypto = interaction.options.getString('crypto');
    const cryptoName = interaction.options.get('crypto').value;
    console.log(cryptoName);
    const data = await cryptoData.getPrice(crypto);
    const cryptoChartData = await Chart.ChartIt(crypto);
    const myChart = new QuickChart();
    myChart
      .setConfig(cryptoChartData)
      .setBackgroundColor('rgb(0, 23, 31)')
      .setHeight(500)
      .setWidth(800)
      .setVersion('3');
    const cryptoChartLink = await myChart.getShortUrl();
    // console.log(cryptoChartLink);
    console.log(data);
    // // console.log(cryptoChartData);
    const cryptoEmbed = new MessageEmbed()
      .setTitle(`${cryptoName[0].toUpperCase() + crypto.substr(1)}`)
      .setDescription('Latest market data')
      .setColor('#01234')
      .setThumbnail(
        `https://raw.githubusercontent.com/condacore/cryptocurrency-icons/master/32x32/${cryptoName}.png `
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
      )
      .setImage(cryptoChartLink);
    await interaction.reply({
      embeds: [cryptoEmbed],
    });
  },
};
