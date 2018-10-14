function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Review Analysis Tools')
    .addItem('Analyze Sentiment', 'analyzeSentiment')
    .addToUi();
}

function analyzeSentiment() {
 
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
  
    var startRow = 2;
    var startColumn = 1;
    var numColumns = sheet.getLastColumn();
    var numRows = sheet.getLastRow();
    
  
    //Get the number of rows
    var dataRange = sheet.getRange(startRow,startColumn,numRows-1,numColumns);
    var data = dataRange.getValues();
    for (var i = 0; i < data.length; ++i) {
      var row = data[i];
      var review = row[3]; //review column
      
      //Invoke the retrieveSentiment method
      var score = retrieveSentiment(review);
      
      //Find the cell in the row (5th column) to insert the Sentiment score.
      var range = sheet.getRange(startRow+i,numColumns);
      //range.setValue(score);
      if (score < 0 && score > -0.25) {
        range.setBackground("#fcaeb4");
      } else if (score < -0.25) {
        range.setBackground("#f7021f");
      } else if (score > 0 && score < 0.25) {
        range.setBackground("#affcae");
      } else if (score > 0.25) {
        range.setBackground("#01f774");
      } else {
        range.setBackground("#f2f701");
      }
    }
}

function retrieveSentiment (line) {
  var apiKey = "AIzaSyB_Tkq7mq4sQQWxz7h--H7YyQmYy6mR4_c";
  var apiEndpoint = 'https://language.googleapis.com/v1/documents:analyzeSentiment?key=' + apiKey;


  var reviewData = {
    language: 'en-us',
    type: 'PLAIN_TEXT',
    content: line
  };
  
  var nlAPIData = {
    document: reviewData,
    encodingType: 'UTF8'
  };
  
  var nlCallOptions = {
    method : 'post',
    contentType: 'application/json',
    payload : JSON.stringify(nlAPIData)
  }
  
  var response = UrlFetchApp.fetch(apiEndpoint, nlCallOptions);
  
  var data = JSON.parse(response);
  
  var sentiment = 0.0;
  if (data && data.documentSentiment && data.documentSentiment.score){
     sentiment = data.documentSentiment.score;
  }
  
  return sentiment;
}