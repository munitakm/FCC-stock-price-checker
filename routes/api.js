'use strict';
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

let stockPrice = "";
module.exports = function (app) {

const stockSchema = mongoose.Schema({stock: {type: String, required: true}, ip: {type: String, required: true}, likes: Number});
const StockIp = mongoose.model('StockIp', stockSchema);

  app.route('/api/stock-prices')
    .get(function (req, res){
	let ipAddress = "";
	let stockList = req.query.stock;
	let likeBox = req.query.like == "true"? true :  false;
	console.log(req.query);
	if(typeof stockList == "object") {
		console.log("tem 2 preços");
	
	} else {
		console.log("tem 1 preço");
		bcrypt.hash(req.socket.remoteAddress, 12, (err, hash) => {
		ipAddress = hash;
		const request = new StockIp({stock: stockList.toUpperCase(), ip: hash});
		request.save()
		});
		


	}
	let dbComparisson = "";
	StockIp.findOne({stock: "GOOG"}, (err, res) => { 
	console.log(res);
	dbComparisson = res.ip
	})
	let result = bcrypt.compareSync(ipAddress, dbComparisson);
	console.log("os ip são iguais?", result);
    });
    
};
