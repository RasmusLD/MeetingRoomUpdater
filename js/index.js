$(document).ready(function(){

//updates the JSON one time, once the document is ready
$(function iniUpdate(){
    updateListJQ();
});

//auto-update the JSON every X miliseconds (every 30 seconds right now)
autoUpdate = setInterval(function() {updateListJQ();}, 30000);

//handles/changes the html to show if occupied or free
function occupiedOrFree() {
    var text = "";
    var color = "";
    //calls oocupationEvaluater to see if the meetingroom should be occupied or free
    if(occupationEvaluater()) {
        //set meeting room as occupied
        text = "Ledigt";
        color = "green";
    }else {
        //set meetingroom as free
        text = "Optaget";
        color = "red";
    }
    occupancyChanger(text, color);
}

//evaluates if the meetingroom is occupied/free, returns true if free and false if occupied.
function occupationEvaluater() {
    var dT = new Date();
    var time = Math.round(dT.getTime() / 1000);

    if(time>firstStart && time<firstEnd) {
        return false;
    }else{
        return true;
    }
}


//update list function using JQuery mobile
var updateListJQ = function() {
    win = document.getElementById("whoIsNext");
    toBePrinted = "";
    $.getJSON('http://is2015020209pswc.wp.olo.dk/', function(json){
        if(json.total_results !== 0) {
            
            for(var i = 0; i < json.length; i++) {
                toBePrinted += "<p>Booked fra: " + json[i].start_tid.substring(8,10) + "/" +
                json[i].start_tid.substring(5,7) + " " + 
                json[i].start_tid.substring(11, 16) + " til: " + 
                json[i].slut_tid.substring(11, 16) + " af: " + 
                json[i].firmanavn + "</p>";
                
                firstStart = json[0].epocstart;
                firstEnd = json[0].epocend;
                occupiedOrFree();
            }
            $(win).empty();
            $(win).append(toBePrinted);
        }else {
            //failure to get JSON
            $(win).empty();
            $(win).append("<p>json not found</p><p>No JSON was returned... Contact an administrator.</p>");
        }
    });
};

//changes the occupancy state of the freeOrOccupied html element
function occupancyChanger(text, color) {
    var foo = document.getElementById("freeOrOccupied");
    var fooP = document.getElementById("freeOrOccupiedP");
    foo.style.background = color;
    fooP.innerHTML = text;
}

butUp = document.getElementById("body_update").addEventListener ("click", update_button, false);
    
    function update_button() {
        var fooP = document.getElementById("freeOrOccupiedP");
        fooP.innerHTML = "Manuel updatering, vent venligst.";
        updateListJQ();
    }
});