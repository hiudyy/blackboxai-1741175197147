const axios = require('axios');
const cheerio = require('cheerio');

async function styleText(text) {return new Promise((resolve, reject) => {axios.get('http://qaz.wtf/u/convert.cgi?text=' + text).then(({data}) => {let $ = cheerio.load(data);let result = [];$('table > tbody > tr').each(function (a, b) {result.push($(b).find('td:nth-child(2)').text().trim())}), resolve(result)})})};

module.exports = styleText;