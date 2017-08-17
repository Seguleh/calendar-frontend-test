var month=['January','February','March','April','May','June','July','August','September','October','November','December'];
var d=new Date(), currM=d.getMonth(), currY=d.getFullYear();

window.onload = function (){

  setDate('calendar-my', month[d.getMonth()]+' '+currY);
  makeCalendar();
};

//Function to handle the date (month-year and current date in calendar)
function setDate(id, val){

  document.getElementById(id).innerHTML = val;
};

// Function that handles the month-year change
function changeDate(id) {

  curr = document.getElementById('calendar-my').innerHTML.trim().split(" ")
  currM = month.indexOf(curr[0]);
  if(id == 'next'){
    if (currM == 11){
      currM=0;
      currY++;
    }else{
      currM++;
    }
    setDate('calendar-my', month[currM]+' '+currY);
    $("#calendar").remove();
    $('<tbody id="calendar"></tbody>').fadeIn(1000).insertAfter("thead");
    makeCalendar();
  }else{
    if (currM == 0){
      currM=11;
      currY--;
    }else{
      currM--;
    }
    setDate('calendar-my', month[currM]+' '+currY);
    $("#calendar").remove();
    $('<tbody id="calendar"></tbody>').fadeIn(1000).insertAfter("thead");
    makeCalendar();
  }
};

function makeCalendar () {

  var i = m = 1;

  // Get the first day of the week in set month and year: 0=Su, 1=Mo, 2=Tu, etc
  var firstDay = new Date(currY, currM, 1).getDay();

  // Get number of days in a month
  var daysMonth = new Date(currY, currM, 0).getDate();
  //Creating the days in a month, taking into account the firstDay of the week
  loop1:
   for (n = 1; n < 6; n++) {
     r = document.getElementById('calendar').appendChild(document.createElement("tr"));
     r.setAttribute("id", "row"+n);
    for (j = 0; j < 7; j++) {
      if (m > daysMonth) {
        break loop1;
      }
      if (i > firstDay) {
        td = document.createElement("td");
        td.appendChild(document.createTextNode(m.toString()));
        if (d.getMonth() == currM && m == d.getDate()){
          td.setAttribute("class", "currDay")
        }
        document.getElementById('row'+n).appendChild(td);
        m++;
      }else {
        document.getElementById('row'+n).appendChild(document.createElement("td"));
      }
      i++;
    }
   }
};
