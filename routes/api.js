'use strict';

let mongodb = require('mongodb');
let mongoose = require('mongoose');

module.exports = function (app) {

  let uri = 'mongodb+srv://enricovgnani:' + process.env.PW + '@freecodecamp.gxcxe.mongodb.net/stock_price_checker?retryWrites=true&w=majority&appName=freeCodeCamp';

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  let stockSchema = new mongoose.Schema({
    name: {type: String, required: true},
    likes: {type: Number, default: 0},
    ips: [String]
  });

  let Stock = mongoose.model('Stock', stockSchema);

  app.route('/api/stock-prices')
    .get(function (req, res){
      let responseObject = {};
      responseObject['stockData'] = {};

      let twoStocks = false;

      let outputResponse = () => {
        return res.json(responseObject)
      }

      let findOrUpdateStock = (stockName, documentUpdate, nextStep) => {
        Stock.findOneAndUpdate(
            {name: stockName},
            documentUpdate,
            {new: true, upsert: true},
            (error, stockDocument) => {
                if(error){
                console.log(error)
                }else if(!error && stockDocument){
                    if(twoStocks === false){
                      return nextStep(stockDocument, processOneStock)
                    }
                }
            }
        )
      }

      let likeStock = (stockName, nextStep) => {

      }

      let getPrice = (stockDocument, nextStep) => {
        nextStep(stockDocument, outputResponse)
      }

      let processOneStock = (stockDocument, nextStep) => {
        responseObject['stockData']['stock'] = stockDocument['name'];
        nextStep()
      }

      let stocks = []
      let processTwoStocks = (stockDocument, nextStep) => {
        
      }

      if(typeof (req.query.stock) === 'string') {
        let stockName = req.query.stock;

        let documentUpdate = {};
        findOrUpdateStock(stockName, documentUpdate, getPrice);
      
      } else if (Array.isArray(req.query.stock)) {
       twoStocks = true;

      }
    });
    
};
