'use strict';
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (app) => {
	const likeSchema = 	mongoose.Schema({
		stockName: {type: String, required: true}, 
		ips: {type: [Array]i, default: [],
		likes: {type: Number, default: 0}
		}});
	const Likes = mongoose.model('Likes', likeSchema);

	app.route('/api/stock-prices')
		.get(async(reqm res) => {
			let stock = req.query.stock;
			let info1;
			let info2;
			const likeBox = req.query.like == "true"? true : false;
			const ipAd = bcrypt.hashSync(req.socket.remoteAddress);
			if(typeof stock) {
			//1 Stock//
			stock = stock.toUpperCase();
			const test = await exist(stock);
				if(test && !likeBox) {
					info1 = await Likes.findOne({stockName: stock});
					let show = await sendInfo(stock, info.likes);
					res.send({"stockData": show})
				} else if (test && likeBox) {
					info1 = await Like.findOne({stockName: stock}, info1.ips, req.socket.remoteAddress);
				let validation = await validIp(info1.ips, req.socket.remoteAddress);
					if(validation) {
						addLike(stock);
						let show = await sendInfo(stock, info1.likes++);
						res.send({"stockData": show});
					} else {
						let show = await sendInfo(stock, info1.likes);
						res.send({"stockData": show})
					}
				} else if(!test) {
					await creatStock(stock, likeBox);
					let likeNum = likeBox? 1 : 0;
					let show = await sendInfo(stock, likeNum)
					res.send({"stockData": show})
				}



			} else {
			//2 Stock//
			}
		})
	const exist = (st) => {
		return Likes.exists({stockName: st})
	}

	const getPrice = (st) => {
		let price = fetch(
`http://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${st.toLowerCase()}/quote`)
		.then(response => response.json())
		.then(json => json.latestPrice);
	}
	const sendInfo= async (st, like) => {
		let price = await getPrice(st);
		return price? 
			{"stock": st, "price": price, "likes": like} :
			{"error": "external source error", "likes": like}

	}
	const validIp = (list, ip) {
		if(list == []) return true;
		for(let i of list) {
			if(bcrypt.compareSync(ip, i) return false
		} return true
	};
	const createStock = (st, like) => {
	like? Likes.create({stockName: st, ips: [ipAd]}, like: 1) :
		  Like.create({stockName: stock});
	}
}
