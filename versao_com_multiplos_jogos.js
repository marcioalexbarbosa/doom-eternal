const request = require('request');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const moment = require('moment');

const urls_to_check =
  [
    {name: 'streets of rage 4', url: 'https://www.microsoft.com/pt-br/p/streets-of-rage-4/9n7h54kncb9n?activetab=pivot:overviewtab', price: '0'},
    {name: 'battletoads', url: 'https://www.microsoft.com/pt-br/p/battletoads/9n7gcf5sgcxc?activetab=pivot:overviewtab', price: '0'},
    {name: 'capcom beat n up bundle', url: 'https://www.microsoft.com/pt-br/p/capcom-beat-em-up-bundle/bv26w4btclkg?activetab=pivot:overviewtab', price: '0'},
    {name: 'sega genesis classics', url: 'https://www.microsoft.com/pt-br/p/sega-genesis-classics/c5fnhqsqmsl6?activetab=pivot:overviewtab', price: '0'}
  ];

const send = require('gmail-send')({
  user: '*******@gmail.com',
  pass: '*******',
  to: '*******@gmail.com'
});

const executeJob = () => {

  urls_to_check.forEach(function(item, index) {
  const options = {
    url: item.url,
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function (err, res, body) {
    const $ = cheerio.load(body);
    const price = $('#ProductPrice_productPrice_PriceContainer');
    const priceText = price.text();
    const dateStr = moment().format("DD/MM HH:mm");
    if (priceText == item.price) {
      console.log('no change as of ' + dateStr);
      return;
    }
    send({
      text: priceText,
      subject: item.name + ' - ' + dateStr
    }, (error, result, fullResult) => {
      if (error) console.error(error);
      console.log(result);
      item.price = priceText;
    })
  });
  }
  );

}

var j = schedule.scheduleJob('0 */6 * * *', function () {
  executeJob();
});
