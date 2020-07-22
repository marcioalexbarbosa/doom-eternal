const request = require('request');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const moment = require('moment');

var priceBefore = undefined;

const send = require('gmail-send')({
  user: '*****@gmail.com',
  pass: '*****',
  to: '*****@gmail.com'
});

const executeJob = () => {
  const options = {
    url: 'https://www.microsoft.com/pt-br/p/doom-eternal-standard-edition/9p5s26314hwq?activetab=pivot:overviewtab',
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function (err, res, body) {
    const $ = cheerio.load(body);
    const price = $('#ProductPrice_productPrice_PriceContainer');
    const priceText = price.text();
    const dateStr = moment().format("HH:mm");
    if (priceText == priceBefore) {
      console.log('no change');
      return;
    }
    send({
      text: priceText,
      subject: 'doom eternal - ' + dateStr
    }, (error, result, fullResult) => {
      if (error) console.error(error);
      console.log(result);
      priceBefore = priceText;
    })
  });
}

var j = schedule.scheduleJob('10 * * * *', function () {
  executeJob();
});
