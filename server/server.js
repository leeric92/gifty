var aws = require("aws-lib");

var prodAdv = aws.createProdAdvClient('AKIAIT6MPAH4YTKJ46BA', 'TJlF9dNeQS7ZAn4g6NwWGqRvbp16xvBEyTNAGrSq', 'eric0e7-20');

// console.log(">>>>>>>>>>>prodAdv",prodAdv.client.call)

 // var options = {ItemId: '1118531647', ResponseGroup: 'Offers, ItemAttributes, Images'}

var options = {SearchIndex: "Books", Keywords: "Javascript", ResponseGroup: 'Offers, ItemAttributes, Images'}

// prodAdv.call("SimilarityLookup", options, function(err, result) {
prodAdv.call("ItemSearch", options, function(err, result) {
  // console.log(">>>>>>>>>>",result.Items.Item[0].ItemLinks);
  // console.log(">>>>>>>>>>",result.Items.Item[0]);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>",result.Items.Item);


  //get the price 
  //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>",result.Items.Item[0].OfferSummary.LowestNewPrice.FormattedPrice);
})