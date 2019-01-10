const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs')

const currency = 'USD'
const amount = '1'
let data = []
let $, date

generateURL = () => {
    return 'https://www.x-rates.com/table/?from=' + currency + '&amount=' + amount
}

scrap = () => {
    return new Promise((Resolve, Reject) => {
        request({
            method: 'GET',
            url: generateURL()
        }, (err, res, body) => {
            if (err) Reject(err)
            else {
                date = res.headers.date
                $ = cheerio.load(body.toString());
                var temp = $('table.tablesorter.ratesTable tbody tr')
                Resolve(temp)
            }
        });
    })
}

structuredData = (d) => {
    d.map(function (i, td) {
        var children = $(this).children();
        var name = children.eq(0);
        var value = children.eq(1);

        var row = {
            "name": name.text().trim(),
            "value": value.text().trim()
        };
        data.push(row);
    })


    return Promise.all(data).then(function (values) {
        var temp = {'date':date, 'currency': currency, 'amount': amount, 'data': values }
        return temp
    });
}

module.exports = {
    data: async (req, res) => {
        try {
            const scrappedData = await scrap()
            const filteredData = await structuredData(scrappedData)
            console.log(filteredData)
            res.json(filteredData)
        } catch (error) {
            res.json({'dataError': error})
        }
    }
}
