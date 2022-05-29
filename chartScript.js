const { ModalBuilder } = require('@discordjs/builders');
const QuickChart = require('quickchart-js');
const fetch = require('node-fetch');

const myChart = new QuickChart();

ChartIt('bitcoin').then((config) => {
  myChart
    .setConfig(config)
    .setBackgroundColor('rgb(0, 23, 31)')
    .setVersion('3');
  console.log(myChart.getUrl());
});

async function ChartIt(coin) {
  const { labels, yAxis } = await historicalPrice(coin);
  const chartObj = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: `${coin} 1W Price in USD`,
          backgroundColor: 'rgb(227, 178, 60)',
          borderColor: 'rgb(227, 178, 60)',
          data: yAxis,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 7,
            color: 'rgb(237, 235, 215)',
            font: {
              size: 12,
              family: 'Courier',
            },
          },
        },
        y: {
          ticks: {
            callback: function (tick, index, array) {
              return '$' + Intl.NumberFormat().format(tick);
            },
            color: 'rgb(237, 235, 215)',
            font: {
              size: 15,
              family: 'Courier',
            },
          },
        },
      },
    },
  };
  return chartObj;
}
async function historicalPrice(crypto) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=usd&days=7&interval=hourly`
    );
    const data = await response.json();
    const hPrices = data.prices;
    const xAxis = hPrices.map((x) => new Date(x[0]).toDateString());
    const newA = xAxis.map((x) => x.substring(0, x.length - 4));
    const yAxis = hPrices.map((x) => x[1]);
    newA.pop();
    yAxis.pop();
    return { labels: newA, yAxis: yAxis };
  } catch (error) {
    console.log('Failed :(', error);
  }
}

module.exports = {
  ChartIt,
};
