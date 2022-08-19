'use strict';
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

module.exports = function (app) {
const likeSchema = mongoose.Schema({stockName: {type: String, required: true}, likes: {type: Number, default: 0}, ips: {type: [String], default: []}});
const Likes = mongoose.model('Likes', likeSchema);

  app.route('/api/stock-prices')
    .get(async function (req, res){

	let ipAddress = bcrypt.hashSync(req.socket.remoteAddress, 12);
		//Distinguish 1 stock input VS 2 stock inputs//
		console.log(typeof req.query.stock);
		if(typeof req.query.stock == "string") {
			let stockOne = {stockName: req.query.stock.toUpperCase()};
			console.log(1);
			const teste = await Likes.exists(stockOne);
		//Checking if the stock is already in the DB//
			if(teste) {
				console.log("existe no banco de dados");
				if(req.query.like == "true") {
					const ipValid = await validIp(stockOne, req.socket.remoteAddress)
					if(ipValid) {
						console.log("ip não encontrado, pode dar like");
						await addLike(stockOne, ipAddress);
						console.log("like dado")
						const show = await sendInfo(stockOne);
						res.send(show)
						
					}
					else {
						const show = await sendInfo(stockOne);
						res.send(show)

					}
				} else {
					console.log("apenas exibir o resultado")
					const show = await sendInfo(stockOne);
					res.send(show)
				}
				

			}
			else {
				console.log("não existe no banco de dados");
				if(req.query.lile == "true") {
					console.log("criar com like");
					await createStock(stockOne.stockName, req.query.like, ipAddress)
					const show = await sendInfo(stockOne)
					res.send(show)
				} else {
					console.log("criar sem like");
					await createStock(stockOne.stockName, req.query.like, ipAddress);
					const show = await sendInfo(stockOne)
					res.send(show)
				}

			}
			 	
			}	
		
		else {
			console.log(2)

		}

	})
	//Functions//
	
	const existStock = (st) => {
		return Likes.exists({stockName: st}, (err, data) => {
			if(err) console.log(err);
			console.log(data)
		});
	}
	const sendInfo = async function(st) {
		const finalInfo = await Likes.findOne(st);
		let s = {"stockData": {"stock": finalInfo.stockName, "price": 99.99, "likes": finalInfo.likes}};
		console.log(s)
		return s
	}


	const addLike = async function(st, ip) {
		  await Likes.findOneAndUpdate(st, ({$inc:{likes: 1}}, {$push: {ips: ip}}));
	} 

	const createStock =  async function(st, like, ip) {
		like == "true"?
			await Likes.create({stockName: st, ips: [ip]})
		:
			await Likes.create({stockName: st});
	};

	const validIp = async function(st, ip) {
		let listIp = await Likes.findOne(st).
			select({ips: 1, _id: 0});
		if(listIp == []) return true
		for(let n of listIp.ips) {
			if(bcrypt.compareSync(ip, n)) return false
		}
		return true
	} 
		


	//End Functions
}
