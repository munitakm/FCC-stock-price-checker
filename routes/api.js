'use strict';
const fetch = require('node-fetch');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
	let stockName = req.query.stock.toLowerCase();
	let stockPrice = "";
	console.log(stockName);
	fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockName}/quote`).
	then(data => data.json()).
	then(response => {
	stockPrice = response.latestPrice;
	});
	res.send({"stock": req.query.stock.toUpperCase(), "stockData": stockPrice, "likes": 99});

    });
    
};
