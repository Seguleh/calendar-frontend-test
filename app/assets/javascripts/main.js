var month=['January','February','March','April','May','June','July','August','September','October','November','December'];
var d=new Date(), currM=d.getMonth(), currY=d.getFullYear(), hDays;

window.onload = function (){

  //Fetch json
  gJson();
  //Set month and year
  setDate('calendar-my', month[d.getMonth()]+' '+currY);
  //Enable Bootstrap tooltips for fast and convenient holiday info
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
};
//Function to handle the date (month-year and current date in calendar)
function setDate(id, val){

  document.getElementById(id).innerHTML = val;
};

//Function to fetch JSON only when it is the first time loading page or when year changes to enchance performance
function gJson() {

  //Handle JSON delay
  $('#done').hide();
  $('#loading').show();
  //Get JSON with holiday information
  $.ajax({
    url: "http://nolaborables.com.ar/api/v2/feriados/"+currY,
    dataType: 'json',
    success: function(data) {
        hDays = data;
    },
    complete: function(){
      //Show calendar once holiday information is retrieved
      var resetH = document.getElementById("holiday-texts");
      resetH.innerHTML = '';
      makeCalendar();
      $('#loading').hide();
      $('#done').show();
      $('.holiday').hover(function(){
            $('#holiday-info'+$(this).text()).stop().fadeIn(500);
            }, function(){
            $('#holiday-info'+$(this).text()).stop().fadeOut(500);
      });
    },
    error: function(){
      //Show error message, with effects, if getting the JSON fails
      $(".alert").fadeIn(600).show().fadeTo(1800, 500).slideUp(500);
      hDays = [];
    }
  });
};

// Function that handles the month-year change to create said calendar
function changeDate(id) {

  var curr = document.getElementById('calendar-my').innerHTML.trim().split(" ")
  currM = month.indexOf(curr[0]);
  if(id == 'next'){
    //Increment month or check if its December and reset with year increment
    if (currM == 11){
      currM=0;
      currY++;
      gJson();
    }else{
      currM++;
      var resetH = document.getElementById("holiday-texts");
      resetH.innerHTML = '';
      makeCalendar();
      $('.holiday').hover(function(){
            $('#holiday-info'+$(this).text()).stop().fadeIn(500);
            }, function(){
            $('#holiday-info'+$(this).text()).stop().fadeOut(500);
      });
    }
  }else{
    //Decrement month or check if its January and reset with year decrement
    if (currM == 0){
      currM=11;
      currY--;
      gJson();
    }else{
      currM--;
      var resetH = document.getElementById("holiday-texts");
      resetH.innerHTML = '';
      makeCalendar();
      $('.holiday').hover(function(){
            $('#holiday-info'+$(this).text()).stop().fadeIn(500);
            }, function(){
            $('#holiday-info'+$(this).text()).stop().fadeOut(500);
      });
    }
  }
};

//Function to make the calendar, checking month days in relation to year
function makeCalendar () {

  //Update month and year if applicable
  setDate('calendar-my', month[currM]+' '+currY);
  //Remove old calendar
  $("#calendar").remove();
  //Build tbody of new calendar and apply Fade effect
  $('<tbody id="calendar"></tbody>').fadeIn(800).insertAfter("thead");

  var i = m = 1, holD;
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
        //Search for holiday
        holD = hDays.filter(function(daysM){
          return daysM.mes == currM+1 && m == daysM.dia;
        });
        //Create holiday date
        if (typeof holD[0] != 'undefined'){
          if (holD[0].dia == m) {
            f = document.createElement("span");
            f.setAttribute("class", "holiday");
            h = document.createElement("p");
            h.setAttribute("class", "eachH");
            h.setAttribute("id", "holiday-info"+m);
            //Upercase on first char
            type = holD[0].tipo.charAt(0).toUpperCase() + holD[0].tipo.slice(1);
            //Fix word
            type = type == "Nolaborable" ? "No Laborable" : type;
            h.innerHTML = holD[0].motivo+" "+"("+type.bold()+")";
            document.getElementById("holiday-texts").appendChild(h);
            // f.setAttribute("data-toggle", "tooltip");
            // f.setAttribute("data-placement", "right");
            // f.setAttribute("title", holD[0].motivo+" "+"("+holD[0].tipo.charAt(0).toUpperCase() + holD[0].tipo.slice(1)+")");
            f.appendChild(document.createTextNode(m.toString()));
            td.appendChild(f);
          }
        }else{
          td.appendChild(document.createTextNode(m.toString()));
        }
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
