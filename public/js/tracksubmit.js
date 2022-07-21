var t = window.TrelloPowerUp.iframe();

var $TABLE = $('#table');
var $BTN = $('#export-btn');
var $EXPORT = $('#export');

function addTrackingEntry(){
  return t.member('fullName').then(function(member){
      var nameString = member['fullName'];
      var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
      var x = document.getElementById("trackForm");
      var dateString = x.elements[0].value;
      var timeString = x.elements[1].value;
      $clone.find(".name").html(nameString);
      $clone.find(".date").html(dateString);
      $clone.find(".time").html(timeString);
      $TABLE.find('table').append($clone);
      x.reset();    
  });
}

function saveTableToTrelloOld(){
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];
  var dataString = "";
  var iter = 0;
  $($rows.shift()).find('th:not(:empty)').each(function () {
    if (iter < 3){
      headers.push($(this).text());
      iter++;
    }
  });
  $rows.each(function () {
    var $td = $(this).find('td');
    var h = {};
    headers.forEach(function (header, i) {
      h[header] = $td.eq(i).text();   
    });
    data.push(h);
  });
  dataString = encodeURIComponent(JSON.stringify(data));
  t.set('card', 'shared', 'timeTrackingData', dataString);
}

function setHeaderString(headerString){
  return t.set('card', 'shared', 'headerTrackData', headerString);
}

function setNameString(nameString){
  return t.set('card', 'shared', 'nameTrackData', nameString.slice(0, -1));  
}

function setDateString(dateString){
  return t.set('card', 'shared', 'dateTrackData', dateString.slice(0, -1));
}

function setTimeString(timeString){
  return t.set('card', 'shared', 'timeTrackData', timeString.slice(0, -1));  
}

function saveTableToTrello(){
  var $rows = $TABLE.find('tr:not(:hidden)');
  var headers = [];
  var data = [];
  var dataString = "";
  var headerString = "";
  var nameString = "";
  var dateString = "";
  var timeString = "";
  var iter = 0;
  $($rows.shift()).find('th:not(:empty)').each(function () {
    if (iter < 3){
      headers.push($(this).text());
      iter++;
    }
  });
  $rows.each(function(){
    var $td = $(this).find('td');
    nameString = nameString.concat($td.eq(0).text(), ',');
    dateString = dateString.concat($td.eq(1).text(), ',');
    timeString = timeString.concat($td.eq(2).text(), ',');    
  })
  headerString = headers.join(',');
  setHeaderString(headerString).then(function(){
    setNameString(nameString).then(function(){
      setDateString(dateString).then(function(){
        setTimeString(timeString).then(function(){
          t.closeModal();
        });
      });
    });
  });
}

function getHeaderString(){
  return t.get('card', 'shared', 'headerTrackData', 'error').then(function(data){
      document.getElementById("headerVar").innerHTML = data;
  });  
}

function getNameString(){
  return t.get('card', 'shared', 'nameTrackData', 'error').then(function(data){
      document.getElementById("nameVar").innerHTML = data;
  });  
}

function getDateString(){
  return t.get('card', 'shared', 'dateTrackData', 'error').then(function(data){
      document.getElementById("dateVar").innerHTML = data;
  }); 
}

function getTimeString(){
  return t.get('card', 'shared', 'timeTrackData', 'error').then(function(data){
      document.getElementById("timeVar").innerHTML = data;
  }); 
}

function addRowFromData(nameString, dateString, timeString){
  var $clone = $TABLE.find('tr.hide').clone(true).removeClass('hide table-line');
  $clone.find(".name").html(nameString);
  $clone.find(".date").html(dateString);
  $clone.find(".time").html(timeString);
  $TABLE.find('table').append($clone);  
}

function loadTableFromTrello(){
  getHeaderString().then(function(){
      getNameString().then(function(){
        getDateString().then(function(){
          getTimeString().then(function(){

            var tempString = document.getElementById("headerVar").innerHTML;
            var headerArray = tempString.split(",");
            
            var tempString = document.getElementById("nameVar").innerHTML;
            var nameArray = tempString.split(",");
            document.getElementById("tempVar").innerHTML = nameArray.join('-');
            
            var tempString = document.getElementById("dateVar").innerHTML;
            var dateArray = tempString.split(",");

            var tempString = document.getElementById("timeVar").innerHTML;
            var timeArray = tempString.split(",");
            
            var countHeader = headerArray.length;
            var maxElements = Math.max(nameArray.length, dateArray.length, timeArray.length);
            
            for(let i=0; i<maxElements; i++){
              var nameString = nameArray[i];
              var dateString = dateArray[i];
              var timeString = timeArray[i];
              if (dateArray[i] !== 'error'){
                addRowFromData(nameString, dateString, timeString);                
              }
            }
            
          });
        });
      });
  });
}            

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], {type: "text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}


function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");    
    for (var i = 0; i < rows.length; i++) {
        if(i !== 1){
          var row = [], cols = rows[i].querySelectorAll("td, th");        
          for (var j = 0; j < 3; j++) 
              row.push(cols[j].innerText);        
          csv.push(row.join(","));           
        }
       
    }
    downloadCSV(csv.join("\n"), filename);
}