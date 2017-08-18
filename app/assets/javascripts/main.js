var month=['January','February','March','April','May','June','July','August','September','October','November','December'];
var d=new Date(), currM=d.getMonth(), currY=d.getFullYear(), hDays;

window.onload = function (){

  //Fetch json
  gJson();
  //Set month and year
  setDate('calendar-my', month[d.getMonth()]+' '+currY);
  makeCalendar();
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
};

//Function to handle the date (month-year and current date in calendar)
function setDate(id, val){

  document.getElementById(id).innerHTML = val;
};

//Function to fetch JSON only when is first time loading page or when year changes
function gJson() {

  $.ajax({
    url: "http://nolaborables.com.ar/api/v2/feriados/"+currY+"?incluir=opcional",
    async: false,
    dataType: 'json',
    success: function(data) {
        hDays = data;
    }
  });
};

// Function that handles the month-year change
function changeDate(id) {

  curr = document.getElementById('calendar-my').innerHTML.trim().split(" ")
  currM = month.indexOf(curr[0]);
  if(id == 'next'){
    //Increment month or check if its December and reset with year increment
    if (currM == 11){
      currM=0;
      currY++;
      gJson();
    }else{
      currM++;
    }
    setDate('calendar-my', month[currM]+' '+currY);
    //Remove old calendar
    $("#calendar").remove();
    //Build tbody of new calendar and apply Fade effect
    $('<tbody id="calendar"></tbody>').fadeIn(800).insertAfter("thead");
    makeCalendar();
  }else{
    //Decrement month or check if its January and reset with year decrement
    if (currM == 0){
      currM=11;
      currY--;
      gJson();
    }else{
      currM--;
    }
    setDate('calendar-my', month[currM]+' '+currY);
    //Remove old calendar
    $("#calendar").remove();
    //Build tbody of new calendar and apply Fade effect
    $('<tbody id="calendar"></tbody>').fadeIn(800).insertAfter("thead");
    makeCalendar();
  }
};

function makeCalendar () {

  var i = m = 1;
  // Get the first day of the week in set month and year: 0=Su, 1=Mo, 2=Tu, etc
  var firstDay = new Date(currY, currM, 1).getDay();
  // Get number of days in a month
  var monthS = new Date(currY, currM, 1);
  var monthE = new Date(currY, currM+1, 1);
  var daysMonth = Math.round((monthE - monthS)/(1000*60*60*24));
  //Creating the days in a month, taking into account the firstDay of the week
  loop1:
   for (n = 1; n < 7; n++) {
     //Creating new tr's with row id
     r = document.getElementById('calendar').appendChild(document.createElement("tr"));
     r.setAttribute("id", "row"+n);
    for (j = 0; j < 7; j++) {
      //Break loop if daysMonth is achieved
      if (m > daysMonth) {
        break loop1;
      }
      if (i > firstDay) {
        //Create td with day number
        td = document.createElement("td");
        td.appendChild(document.createTextNode(m.toString()));
        //Create festivity date
        // if (true) {
        //   f = document.createElement("a");
        //   f.setAttribute("class", "holiday btn");
        //   f.setAttribute("data-toggle", "tooltip");
        //   f.setAttribute("data-placement", "right");
        //   f.setAttribute("title", "Año Nuevo");
        //   f.appendChild(document.createTextNode(m.toString()));
        //   td.appendChild(f);
        // }
        //Highlight current day
        if (d.getMonth() == currM && m == d.getDate()){
          td.setAttribute("class", "currDay")
        }
        document.getElementById('row'+n).appendChild(td);
        m++;
      }else {
        //Create td without number to maintain aspect of calendar
        document.getElementById('row'+n).appendChild(document.createElement("td"));
      }
      i++;
    }
   }
};
