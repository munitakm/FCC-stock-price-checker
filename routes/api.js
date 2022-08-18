'use strict';
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

let stockPrice = "";
module.exports = function (app) {

const likeSchema = mongoose.Schema({stockName: {type: String, required: true}, likes: {type: Number, default: 0}, ips: [String]});
const Likes = mongoose.model('Likes', likeSchema);

  app.route('/api/stock-prices')
    .get(function (req, res){
		let ipAddress = bcrypt.hashSync(req.socket.remoteAddress, 12);
		//console.log(typeof req.query.stock)
		if(typeof req.query.stock != "object") {
			if(req.query.likes == "true") {

			}	
		}
		else {

		}

	})
	//Functions//
	const sendInfo = function(st) {
		Likes.findOne(st, (err, found) => {
			if(err) console.log(err);
			return {stock: found.stockName.toUpperCase(), likes: found.likes}
		})
	}
	const addLike = function(st, ip) {
		  findAndUpdate({stockName: st}, ({$push:{ips: ip}, $inc: {likes: 1}}));
	}

	const createStock = function(st, like, ip) {
		like == "true"?
			Likes.create({stockName: st, ips: [ip], likes: 1 })
		:
			Likes.create({stockName: st});
	};

	const validIp = function(st, ip, like) {
		Likes.find({stockName: st}, (err, ipList) => {
			if(ipList == null) return true;
			for(n of ipList.ip) {
				if(bcryp.compareSync(ip, n)) {
					return  true;
				};
			} return false; 
		})
	};

	const existStock = function(st) {
		Likes.find({stockName: st}, (err, found) =>{
			if(found == null) return false;
			return true
		})
	};

	//End Functions
}
