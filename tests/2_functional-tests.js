const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', function() {
	let stockData = ["GOOG", "MSFT"];
	var likesData = [0, 0];
	test('Viewing one stock: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
		.get('/api/stock-prices')
		.query({stock: stockData[0]})
		.end((err, res) => {
			likesData[0] = res.body.stockData.likes;
			assert.equal(res.status, 200)
			assert.equal(res.body.stockData.stock, stockData[0]);
			assert.isNotNull(res.body.stockData.likes);
			assert.isNotNull(res.body.stockData.price)
			done();
			})
	})
	test('Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
		.get('/api/stock-prices')
		.query({stock: stockData[1], like: "true"})
		.end((err, res) => {
			likesData[1] = res.body.stockData.likes;
			assert.equal(res.status, 200)
			assert.equal(res.body.stockData.stock, stockData[1]);
			assert.isAbove(res.body.stockData.likes, 0);
			assert.isNotNull(res.body.stockData.price);
			done();
			})
	})
	test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
		.get('/api/stock-prices')
		.query({stock: stockData[1], like: "true"})
		.end((err, res) => {
			assert.equal(res.status, 200)
			assert.equal(res.body.stockData.stock, stockData[1]);
			assert.equal(res.body.stockData.likes, likesData[1]);
			assert.isNotNull(res.body.stockData.price);
			done();
			})
});
	test('Viewing two stocks: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
		.get('/api/stock-prices')
		.query({stock: [stockData[0], stockData[1]]})
		.end((err, res) => {
			assert.equal(res.status, 200)
			assert.equal(res.body.stockData[0].stock, stockData[0]);
			assert.equal(res.body.stockData[1].stock, stockData[1]);
			assert.isNotNull(res.body.stockData[0].price);
			assert.isNotNull(res.body.stockData[1].price);
			assert.equal(res.body.stockData[0].rel_likes, likesData[0]-likesData[1]);
			assert.equal(res.body.stockData[1].rel_likes, likesData[1]-likesData[0]);
			done();
			})
});
	test('Viewing two stocks and liking them: GET request to /api/stock-prices/', (done) => {
		chai.request(server)
		.get('/api/stock-prices')
		.query({stock: [stockData[0], stockData[1]], like: "true"})
		.end((err, res) => {
			assert.equal(res.status, 200)
			assert.equal(res.body.stockData[0].stock, stockData[0]);
			assert.equal(res.body.stockData[1].stock, stockData[1]);
			assert.isNotNull(res.body.stockData[0].price);
			assert.isNotNull(res.body.stockData[1].price);
			assert.equal(res.body.stockData[0].rel_likes, likesData[0]-likesData[1]);
			assert.equal(res.body.stockData[1].rel_likes, likesData[1]-likesData[0]);
			done();
			})
});
})
