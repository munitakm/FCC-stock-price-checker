'use strict';
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

module.exports = function (app) {
const likeSchema = mongoose.Schema({stockName: {type: String, required: true}, likes: {type: Number, default: 0}, ips: {type: [String], default: []}});
const Likes = mongoose.model('Likes', likeSchema);

  app.route('/api/stock-prices')
    .get(async function (req, res){
	console.log(req.query)
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
						const likeAdd = await addLike(stockOne, ipAddress);
						console.log("like dado")
						const show = await sendInfo(stockOne);
						res.send(show)
						
					}
					else {
						console.log("ip encontrado, não dar like")
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
				if(req.query.like == "true") {
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
			console.log("Working 2 Stocks");
			let stockTwo = req.query.stock.map(i => i.toUpperCase());
			console.log("verificando a existência no BD");
			for(let n of stockTwo) {
				let teste = await Likes.exists({stockName: n})
				if(!teste) {
					await createStock(n, "false")
				}
		}

			if(req.query.like == "true") {
				for(let i of stockTwo) {
					let valIp = await validIp({stockName: i}, req.socket.remoteAddress)
					if(valIp == true) await addLike({stockName: i}, ipAddress); 
				}
			}
			
			let like1 = await Likes.findOne({stockName: stockTwo[0]});
			let like2 = await Likes.findOne({stockName: stockTwo[1]});
			console.log(like1, like2)
			let relativeLikes = like1.likes - like2.likes;
			console.log(relativeLikes)
			
			let price1 = await sendInfoTwo(stockTwo[0], relativeLikes);
			let price2 = await sendInfoTwo(stockTwo[1], -relativeLikes);
			console.log(req.query)
			
			res.send({"stockData": [price1, price2]})

	}})
	//Functions//
	
	const getPrice = async (st) => {
		return fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${st.toLowerCase()}/quote`)
		.then(response => response.json())
		.then(json => json.latestPrice)
	}
	
	const sendInfo = async function(st) {
		const finalInfo = await Likes.findOne(st);
		const price = await getPrice(st.stockName);
		console.log("Price: ", price)
		console.log(finalInfo)
		return price? {"stockData": {"stock": finalInfo.stockName, "price": price, "likes": finalInfo.likes}}
		:
			{"stockData": {"error": "external source error", "likes": finalInfo.likes}}
	}

	const sendInfoTwo = async(st, rl) => {
		const price = await getPrice(st);
		return price? {"stock": st, "price": price, "rel_likes": rl}:{"rel_likes": rl};
	}

	const addLike = async function(st, ip) {
		  await Likes.findOne(st)
		.updateMany({$push: {ips: ip}, $inc:{likes: 1}})
		
	} 

	const createStock =  async function(st, like, ip) {
		like == "true"?
			await Likes.create({stockName: st, ips: [ip], likes: 1})
		:
			await Likes.create({stockName: st});
	};

	const validIp = async function(st, ip) {
		let listIp = await Likes.findOne(st);
		if(listIp.ips == []) return true
		for(let n of listIp.ips) {
			if(bcrypt.compareSync(ip, n)) return false
		}
		return true
	} 
		


	//End Functions
}
