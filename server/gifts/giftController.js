var Gift = require('./giftModel.js');
var aws = require('aws-lib');
var request = require('request');
var S = require('string');
var Promise = require('bluebird');
var Clarifai = require('../config/clarifai_node.js');
var url = require('url');
var https = require('https');
// var etsyjs = require('etsy-js');
// var etsyClient = etsyjs.client(process.env.ETSY_KEY_STRING);

require('dotenv').load();
var prodAdv = aws.createProdAdvClient(process.env.AMAZON_CLIENT_ID, process.env.AMAZON_CLIENT_SECRET, process.env.AMAZON_ASSOCIATE_TAG);
Clarifai.initAPI(process.env.CLARIFAI_CLIENT_ID, process.env.CLARIFAI_CLIENT_SECRET);

Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) {
  console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
});


module.exports = {
  // call to Amazon API to get a friend's 'liked' item on facebook
  // passing in keyword (ie book title) that we get from facebook, and category, with the req body
  // TODO: need to add category parameter to the clicked object in client side
  lookupItemByKeyword: function(req, res) {
    // hard coding for testing will refactor lataer
    var bookKeyword = req.body.keyword;
    // var temp = JSON.parse(req.body.friend);
    // // console.log('REQ BODY', temp[1].books.data[0].name);
    // var bookKeyword = temp[1].books.data[0].name;

      var options = {SearchIndex: 'Books', Keywords: bookKeyword, ResponseGroup: 'Offers, ItemAttributes, Images, OfferSummary, PromotionSummary'}
      prodAdv.call('ItemSearch', options, function(err, result) {
        res.send(result);
      });
  },

  itemLookup: function(req, res) {
    // hard coding for testing will refactor lataer
    var giftArr = req.body.giftArr;
    // console.log('>>>>', giftArr)
    if(giftArr.books.length !== 0){
      var bookArr = giftArr.books;
    };

    // if(giftArr.music.length !== 0){
    //   var musicArr = giftArr.music;
    // };

    // if(giftArr.etsy.length !== 0){
    //   var etsyArr = giftArr.etsy;
    // };

    // if(giftArr.hasOwnProperty(books)){
    //   var bookArr = giftArr.books;
    // });

    var promises = [];

    var amazonSync = function(bookASIN){
      var options = {SearchIndex: "All", IdType: "ISBN", ItemId: bookASIN, ResponseGroup: 'Offers, ItemAttributes, Images, OfferSummary, PromotionSummary'}
      return new Promise(function(resolve, reject){
        prodAdv.call('ItemLookup', options, function(err, result) {
              if(err !== null){
                return reject(err);
              }
              resolve(result);
        });
      })
    };
    bookArr.forEach(function(ASIN){
      promises.push(amazonSync(ASIN));
    });
    Promise.all(promises).then(function(result){
      console.dir(result);
      result = result.map(function(item){
        if(Array.isArray(item.Items.Item)){
          return item.Items.Item[0];
        }else{
          return item.Items.Item;
        }
      });
      res.send(200,result);
    });
  },

  // call to Amazon API to get similar items based on the 'liked' item
  getSimilarItems: function(req, res) {
    var ASIN = req.body.ASIN;
    var options = {ItemId: ASIN, ResponseGroup: 'Offers, ItemAttributes, Images, OfferSummary, PromotionSummary'}

    // var options = {SearchIndex: 'Books', Keywords: bookKeyword, ResponseGroup: 'Offers, ItemAttributes, Images, OfferSummary, PromotionSummary'}
    prodAdv.call('SimilarityLookup', options, function(err, result) {
      res.send(result);
    });
  },

  getArtistImage: function(req, res, next){

    var promises = [];

    console.log(req.body.artist);

    var aristAsync = function(artist){
      var url = "http://api.bandsintown.com/artists/" + artist
      + "/?api_version=2.0&app_id=Gyftee2015";

      var requestOptions = {
          url: url,
          json: true
      };
      return new Promise(function(resolve, reject){

        request(requestOptions, function(error, response, body) {
          if (error !== null) {
              return reject(error);
              console.log('error>???????????', error)
          }
          resolve(body);
        });
      })
    };
    var artistArr = req.body.artist;
    if(artistArr){
      artistArr.forEach(function(artist){
        promises.push(aristAsync(artist));
      });

      Promise.all(promises).then(function(result){
        // console.dir(result);
        result = result.map(function(item){
          return item;
        });

        // console.log(JSON.stringify(result, null, '\t'));
        res.send(200, result);
      });
    }else{
      res.send(200, 'No Artist Found!');
    }

  },

  getEvents: function(req, res, next){
    var promises = [];
    // console.log('>>> LIST OF ARTIST', req.body.artistArr)

    var eventAsync = function(artist){
      // var options = {SearchIndex: "All", IdType: "ISBN", ItemId: bookASIN, ResponseGroup: 'Offers, ItemAttributes, Images, OfferSummary, PromotionSummary'}
      var url = 'http://api.bandsintown.com/events/search.json?artists%5B%5D='
                + artist
                +'&date='
                + req.body.startDate
                + ','
                + req.body.endDate
                + '&location='
                + req.body.loc
                + '&radius=150&app_id=Gyftee';
      var requestOptions = {
        url: url,
        json: true
      };
      return new Promise(function(resolve, reject){
        request(requestOptions, function(error, response, body) {
          if (error !== null) {
                return reject(error);
          }
          resolve(body);
        });
      })
    };
    var artistArr = req.body.artistArr;
    if(artistArr){
      artistArr.forEach(function(artist){
        artist = artist.split(" ").join("+");
        promises.push(eventAsync(artist));
      });

      Promise.all(promises).then(function(result){
        // console.dir(result);
        result = result.map(function(item){
          return item;
        });

        // console.log('>>>>>>>>>',result)
        result = result.filter(function(array1){
          return array1.length !== 0;
        }).filter(function(array2){
          return Array.isArray(array2) === true;
        });
        // console.log(JSON.stringify(result, null, '\t'));
        res.send(200,result);
      });
    }else{
      res.send(200,null);
    }

 },

  getTagsFromClarifai: function(req, res, next){

    var imageURL = req.body.imageURL;
    Clarifai.tagURL( imageURL , "image 1",function(err, result){
      console.log('Result',JSON.stringify(result, null, '\t'));
      var tagArr = result.results[0].result.tag.classes;
      console.log(tagArr)
      res.send(200, tagArr);
    });
  },

//   getTagsFromMetamindDraft: function(req, res, next){

//     var imageArr = req.body.imageArr;
//     imageArr = imageArr[0].slice(0,3);
//     // console.log(imageArr);


//     var promises = [];

//     var imageClassifyAsync = function(image){
//       var post_data = JSON.stringify({'classifier_id':'imagenet-1k-net','image_url':image});

//     // // var imageURL = req.body.imageURL;
//       var API_KEY = 'Basic ' + process.env.METAMIND_API_KEY;
//       var https_options = url.parse('https://www.metamind.io/vision/classify');
//       https_options.method = 'POST';
//       https_options.headers = {
//               "Authorization": "Basic aXZxkB3eOMupDZSMNIZSdfD9hxv2zBDpen8qbMOOPLtzYwhx2X",
//               'Content-Type': 'application/json',
//               'Content-Length': post_data.length
//       }
//       return new Promise(function(resolve, reject){
//         // var post_request = https.request(https_options, function(response, err) {
//         // if(err !== null){
//         //     return reject(err);
//         // }
//         // // resolve(response)
//         // response.setEncoding('utf8');
//         //   response.on('data', function (chunk) {
//         //     console.log(chunk)

//         // //     // resolve(response);
//         // //     // response.setEncoding('utf8');
//         // //     // response.on('data', function (chunk) {
//         // //     //     resolve(chunk);
//         // //     // })
//         // });
//         // resolve(response)

//         var options = {
//           method: 'POST',
//           uri: 'https://www.metamind.io/vision/classify',
//           image_url: image,
//           classifier_id: 'imagenet-1k-net',
//           headers: {
//               "Authorization": "Basic aXZxkB3eOMupDZSMNIZSdfD9hxv2zBDpen8qbMOOPLtzYwhx2X",
//               'Content-Type': 'application/json',
//               'Content-Length': post_data.length
//           }
//         }

//         request(options).on('response', function(error, response, body) {
//           // if(error !== null){
//           //     return reject(error);
//           // }
//           // resolve(body);
//           console.log(error)
//         });
//       // post_request.write(post_data);
//       // post_request.end();
//   });
// };

//     // if(imageArr){
//       imageArr.forEach(function(image){
//         console.log(image.source);
//         promises.push(imageClassifyAsync(image.source));
//       });


//       Promise.all(promises).then(function(result){
//         console.dir(result);
//         result = result.map(function(item){
//           return item;
//         });
//         console.log(result)
//         // console.log(JSON.stringify(result, null, '\t'));
//         // res.send(200,result);
//       });
//     // }else{
//     //   res.send(200,null);
//     // }



//     // var options = {
//     //   uri: 'https://www.metamind.io/vision/classify',
//     //   image_url: imageURL,
//     //   classifier_id: 'imagenet-1k-net',
//     //   headers: {
//     //     'Authorization': API_KEY,
//     //   }
//     // }
//     // var result;
//     // request(options).on('response', function(response) {
//     //     console.log(response.body);
//     // });
//   },

  getTagsFromMetamind: function(req, res, next){

  // req.body.imageArr[0][9].source

  var imageArr = req.body.imageArr.slice(0)[0][0];
  var promises = [];
  var imageClassifyAsync = function(image){
    var post_data = JSON.stringify({'classifier_id':'imagenet-1k-net','image_url':image});
    var API_KEY = 'Basic ' + process.env.METAMIND_API_KEY;
    var https_options = url.parse('https://www.metamind.io/vision/classify');
    https_options.method = 'POST';
    https_options.headers = {
            "Authorization": "Basic aXZxkB3eOMupDZSMNIZSdfD9hxv2zBDpen8qbMOOPLtzYwhx2X",
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
    }

  return new Promise(function(resolve, reject){
    post_request = https.request(https_options, function(response, err) {
            if(!err){
              return reject(err);
            }
    response.setEncoding('utf8');
    var word = response.on('data', function (chunk) {
          resolve(chunk);
                // var classify = JSON.parse(chunk);
                // var classid = classify.predictions[0].class_name;
                // callback(null, classid);
    });
    });
  });
};

      // imageArr.forEach(function(imageAlbum){
      //   imageAlbum.forEach(function(image){
      //     promises.push(imageClassifyAsync(image.source));
      //   })
      // });
      // imageArr.forEach(function(image){
      //     console.log(image.source + '\n')
      //     promises.push(imageClassifyAsync(image.source));
      // });
      console.log(imageArr.source)
      promises.push(imageClassifyAsync(imageArr.source));

      Promise.all(promises).then(function(result){
        // console.dir(result);
        result = result.map(function(item){
          return item;
        });

        console.log('>>>>>>>>>>>', result)
        // console.log(JSON.stringify(result, null, '\t'));
        // res.send(200, result);
      });




    // post_request.write(post_data);
    // post_request.end();


    // var options = {
    //   uri: 'https://www.metamind.io/vision/classify',
    //   image_url: imageURL,
    //   classifier_id: 'imagenet-1k-net',
    //   headers: {
    //     'Authorization': API_KEY,
    //   }
    // }
    // var result;
    // request(options).on('response', function(response) {
    //     console.log(response.body);
    // });
  },

  searchEtsy: function(req, res, next){
    var terms = 'panda candy';
    var url = "https://openapi.etsy.com/v2/listings/active.js?keywords="+
            terms + "&limit=12&includes=Images:1&api_key=" + process.env.ETSY_KEY_STRING ;

    var requestOptions = {
     url: url,
     json: true
   };

   request(url, function(error, response, body) {
     if (!error && response.statusCode === 200) {
      var str = JSON.stringify(response.body, null, '\t').replace(/\\/g, "").substr(6);
      str = JSON.parse(str.slice(0, str.length -3));
      // console.log('>>>>>>>RESPONSE', JSON.stringify(str, null, '\t'));
      // console.log('>>>>>>>RESPONSE', JSON.stringify(response, null, '\t').replace(/\\/g, "")).substr(5);
      var body = body.replace(/\\/g, "").substr(5);
      // console.log('>>>>>>>BODY', JSON.stringify(JSON.parse(body.slice(0, body.length -2)), null, '\t'));
      // res.send(body);
    } else {
     res.send({ success: false, message: 'Unknown Error getting result from bandsintown api.'});
   }
  });
},


  // TODO: search etsy using image tags or other facebook metadata
  // and get surprise gifts (grab bag feature)

};
