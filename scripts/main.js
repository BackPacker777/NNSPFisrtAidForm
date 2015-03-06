/* AUTHOR: hbates@northmen.org
*  VERSION: 01.03.2014.1.9
*  CREATED: 12.2012
*  TO DO: Nothing!
*/

"use strict";

var $day, $month, $year, $weekDay;
var $difficultyList = ["Easier", "More difficult", "Most Difficult", "Experts only"];
var $cityStateData = new Array();
var $cityState = new Array();
var $names = setNames();

function readZipCodes() {
     var $zipCodes = [];
     $.ajax({
          url: 'data/ZipCodeDatabase.csv',
          contentType: "text/csv",
          async: false,
          success: function(text) {
               $zipCodes = text.split("\n");
               return;
          }
     });
     return $zipCodes;
}

function setLifts() {
     var $lifts = [];
     $.ajax({
          url: 'data/lifts.csv',
          contentType: "text/csv",
          async: false,
          success: function(text) {
               $lifts = text.split(/\n/);
               return;
          }
     });
     return $lifts;
}

function setHills() {
     var $hills = [];
     $.ajax({
          url: 'data/hills.csv',
          contentType: "text/csv",
          async: false,
          success: function(text) {
               $hills = text.split(/\n/);
               return;
          }
     });
     $hills.toString();
     return $hills;
}

function setNames() {
     var $lines = [];
     $.ajax({
          url: 'data/patrollers.csv',
          contentType: "text/csv",
          async: false,
          success: function(text) {
               $lines = text.split(/\n/);
               return;
          }
     });
     return $lines;
}

function createCityStateData() {
     var $zipCodeData = readZipCodes();
     for (var $i = 0; $i < $zipCodeData.length; $i++) {
          $cityStateData[$i] = $zipCodeData[$i].split(",");
     }
}

function populateCityState($zipCode) {
     $zipCodeLower = $zipCode.toLowerCase();
     for (var $i = 0; $i < $cityStateData.length; $i++) {
          if ($zipCodeLower === $cityStateData[$i][0]) {
               $cityState[0] = $cityStateData[$i][1];
               $cityState[1] = $cityStateData[$i][2];
          }
     }
}

function loadCityStates($zip) {
     var $actualZip = ($zip + "Zip");
     var $city = ($zip + "City");
     var $state = ($zip + "State");
     document.getElementById($actualZip).onchange = function() {
          populateCityState(document.getElementById($actualZip).value);
          document.getElementById($city).value = $cityState[0];
          document.getElementById($state).value = $cityState[1];
     }
}

function setDate() {
     var $date = new Date();
     $month = $date.getMonth() + 1;
     $day = $date.getDate();
     $year = $date.getFullYear();
     $weekDay = $date.getDay();
     var $fullDate = ($month + "/" + $day + "/" + $year);
     return $fullDate;
}

function setWeekDayString() {
     var $days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     var $weekDayString = $days[$weekDay];
     return $weekDayString;
}

function removeElement($element) {
     var $div = document.getElementById($element);
     if ($div.firstElementChild) {
          var $removeDiv = $div.firstElementChild;
          $div.removeChild($removeDiv);
     }
}

function setDifficulty($value) {
     var $difficultyList = ["Easier", "More difficult", "Most Difficult", "Experts only"];
     document.getElementById("difficulty").value = $difficultyList[$value - 1];
}

function setAge() {
     var $dob = document.getElementById("dob");
     $dob.onchange = function() {
          var $dobString = document.getElementById("dob").value;
          var $birthDate = new Date($dobString);
          var $age = $year - $birthDate.getFullYear();
          var $birthMonth = ($month - $birthDate.getMonth());
          if ($birthMonth < 0 || ($birthMonth === 0 && $day < $birthDate.getDate())) {
               $age--;
          }
          document.getElementById("age").value = $age;
     }
}

function setLocation() {
     var $locations = document.forms[0].elements["location"];
     //var $counter = 0;

     $locations[0].onclick = function() {
          if($("#whichLift").length == 0) {
               $("#whichHill").remove();
               loadLifts();
          }
          $("input[name=numTimes][value=lift]", $("#history")).prop("checked", true);
     };
     $locations[1].onclick = function() {
          if($("#whichHill").length == 0) {
               $("#whichLift").remove();
               loadHills();
          }
          $("input[name=numTimes][value=hill]", $("#history")).prop("checked", true);
     };
     $locations[2].onclick = function() {
          $("#whichHill").remove();
          $("#whichLift").remove();
     };
}

function loadLifts() {
     var $lifts = setLifts();
     var $select = $('<select size="1" class="select" name="whichLift" id="whichLift">').appendTo('#hillLift');
     $select.append('<option value="" disabled selected>CHOOSE LIFT</option>');
     for (var $i = 0; $i < $lifts.length; $i++) {
          $select.append('<option value="' + $lifts[$i] + '">' + $lifts[$i] + '</option>');
     }
     $("#hillLift").append("</select>");
     $("#whichLift").change(liftChangeEvt);
}

function liftChangeEvt(e) {
     var $liftText = $("select[name='whichLift'").find('option:selected').text();
     document.getElementById("liftName").removeAttribute('hidden');
     document.getElementById("liftName").value = $liftText;
}

function loadHills() {
     var $hills = setHills();
     var $select = $('<select size="1" class="select" name="whichHill" id="whichHill">').appendTo('#hillLift');
     $select.append('<option value="" disabled selected>CHOOSE HILL</option>');
     for (var $i = 0; $i < $hills.length; $i++) {
          var $hillData = $hills[$i].split(',');
          $select.append('<option value="' + $hillData[1] + '">' + $hillData[0] + '</option>');
     }
     $("#hillLift").append("</select>");
     $("#whichHill").change(hillsChangeEvt);
}

function hillsChangeEvt(e) {
     var $hill = $(e.target).val();
     var $hillText = $("select[name='whichHill'").find('option:selected').text();
     document.getElementById("hillName").value = $hillText;
     setDifficulty($hill);
}

function setHelmet() {
     var $helmets = document.forms[0].elements["helmet"];
     var $counter = 0;
     $helmets[0].onclick = function() {
          var $div = document.createElement("div");
          $div.id = "hadHelmet";
          var $line =    '<label for="helmetRental">Helmet area rental?</label>' +
                         'Yes<input type="radio" class="radio" name="helmetRental" value="yes">' +
                         'No<input type="radio" class="radio" name="helmetRental" value="no">';
          $div.innerHTML = $line;
          document.getElementById("helmetYes").appendChild($div);
     };
     $helmets[1].onclick = function() {
          removeElement("helmetYes");
     };
}

function setGlasses() {
     var $glasses = document.forms[0].elements["correctiveLenses"];
     var $counter = 0;
     $glasses[0].onclick = function() {
          var $div = document.createElement("div");
          $div.id = "wornLenses";
          var $line =    '<label for="correctiveLensesWorn">Worn?</label>' +
                         'Yes<input type="radio" class="radio" name="correctiveLensesWorn" id="correctiveLensesWorn" value="yes">' +
                         'No<input type="radio" class="radio" name="correctiveLensesWorn" id="correctiveLensesWorn" value="no">'
          $div.innerHTML = $line;
          document.getElementById("lensesYes").appendChild($div);
     };
     $glasses[1].onclick = function() {
          removeElement("lensesYes");
     };
}

function setInstructor() {
     var $inst = document.forms[0].elements["inLesson"];
     var $counter = 0;
     $inst[0].onclick = function() {
          var $div = document.createElement("div");
          $div.id = "nameInst";
          var $line = '<input name="instructor" id="instructor" class="line" type="text" autofocus placeholder="Instructor">';
          $div.innerHTML = $line;
          document.getElementById("instYes").appendChild($div);
     }
     $inst[1].onclick = function() {
          removeElement("instYes");
     }
}

function setOther() {
     var $other = document.forms[0].elements["numTimes"];
     var $counter = 0;
     $other[2].onclick = function() {
          var $div = document.createElement("div");
          $div.id = "setOther";
          var $line = '<input name="numOther" id="numOther" placeholder="Other Location?" type="text">';
          $div.innerHTML = $line;
          document.getElementById("otherYes").appendChild($div);
     }
     $other[0].onclick = function() {
          removeElement("otherYes");
     }
     $other[1].onclick = function() {
          removeElement("otherYes");
     }
}

function setEquipOther() {
     var $other = document.forms[0].elements["equipmentType"];
     var $counter = 0;
     $other[3].onclick = function() {
          var $div = document.createElement("div");
          $div.id = "setEquipOther";
          var $line = '<input id="otherEquipment" name="otherEquipment" type="text" placeholder="Other type">';
          $div.innerHTML = $line;
          document.getElementById("otherEquipYes").appendChild($div);
     }
     $other[0].onclick = function() {
          removeElement("otherEquipYes");
     }
     $other[1].onclick = function() {
          removeElement("otherEquipYes");
     }
     $other[2].onclick = function() {
          removeElement("otherEquipYes");
     }
}

function populateRental($place) {
     var $div = document.createElement("div");
     $div.id = "rentalPlace";
     if ($place == "nubs") {
          var $line =    '<input id="skiNum" name="skiNum" type="number" placeholder="Ski/Board Number">' +
                         '<input id="bootNum" name="bootNum" type="number" placeholder="Boot Number">';
          document.getElementById("nubsName").value = "Nub's Nob";
          document.getElementById("nubsStreet").value = "500 Nubs Nob Road";
          document.getElementById("shopCity").value = "Harbor Springs";
          document.getElementById("shopState").value = "MI";
          document.getElementById("nubsZip").value = "49770";
     } else {
          var $line =    '<input id="shopName" name="shopName" type="text"placeholder="If rented, shop name">' +
                         '<input id="shopStreet "name="shopStreet" type="text"placeholder="Street number">' +
                         '<input id="shopZip" name="shopZip" type="number"placeholder="Zip code">' +
                         '<input id="skiNum" name="skiNum" type="number" placeholder="Ski/Board Number">' +
                         '<input id="bootNum" name="bootNum" type="number" placeholder="Boot Number">';
     }
     $div.innerHTML = $line;
     document.getElementById("rentalEquip").appendChild($div);
}

function removeRental() {
     var $div = document.getElementById("rentalEquip");
     if ($div.firstElementChild) {
          var $removeDiv = $div.firstElementChild;
          $div.removeChild($removeDiv);
     }
}

function clearRentalAdddress() {
     var $rentalPlaceWrapper = $("#rentalPlace");
     $("input[name=shopName]", $rentalPlaceWrapper).val("");
     $("input[name=shopStreet]", $rentalPlaceWrapper).val("");
     $("input[name=shopCity]", $rentalPlaceWrapper).val("");
     $("input[name=shopZipCode]", $rentalPlaceWrapper).val("");
     $("select[name=shopState]", $rentalPlaceWrapper).val("");
}

function setRental() {
     var $rental = document.forms[0].elements["owner"];
     // Owned
     $rental[0].onclick = function() {
          removeRental();
     }
     // Area Rental
     $rental[1].onclick = function() {
          removeRental();
          populateRental("nubs");
          clearRentalAdddress();
     }
     // Other Rental
     $rental[2].onclick = function() {
          removeRental();
          populateRental("other");
          clearRentalAdddress();
          loadCityStates("shop");
     }
     // Borrowed
     $rental[3].onclick = function() {
          removeRental();
     }
     // Demo
     $rental[4].onclick = function() {
          removeRental();
          populateRental("nubs");
          clearRentalAdddress();
     }
}

function loadPatrollers($placePatroller,$counter) {
     var $patrollerLocation = $placePatroller + $counter;
     var $select = $('<select size="1" name="' + $patrollerLocation + '" id="' + $patrollerLocation + '">').appendTo('#' + $placePatroller);
     $select.append('<option value="" disabled selected>CHOOSE PATROLLER</option>');
     for (var $i = 0; $i < $names.length; $i++) {
          $select.append('<option value="' + $names[$i] + '">' + $names[$i] + '</option>');
     }
     var $chosePatroller = document.forms[0].elements[$patrollerLocation];
     if ($placePatroller != "reportCompleter") {
          $chosePatroller.onchange = function(e) {
               $counter++;
               e.target.onchange = function() {}
               $('#' + $placePatroller).append("<input type='hidden' id='" + $patrollerLocation + "Names' name='" + $placePatroller + "Names' value='" + $(e.target).val() + "'/>");
               loadPatrollers($placePatroller,$counter);
          }
     } else {
          $chosePatroller.onchange = function(e) {
               e.target.onchange = function() {}
               $('#' + $placePatroller).append("<input type='hidden' id='" + $patrollerLocation + "Names' name='" + $placePatroller + "Names' value='" + $(e.target).val() + "'/>");
          }
     }
}

function handleWitnesses($counter) {
     var $div = document.createElement("div");
     $div.id = ("witness" + $counter);
     var $witnesses = document.getElementById('witnesses');
     var $line =    '<input name="w' + $counter + 'LastName" id="w' + $counter + 'LastName" type="text" placeholder="Last Name">' +
                    '<input name="w' + $counter + 'FirstName" id="w' + $counter + 'FirstName" type="text" placeholder="First Name">' +
                    '<input name="w' + $counter + 'Street" id="w' + $counter + 'Street" type="text" placeholder="Street number" class="largeInput">' +
                    '<input name="w' + $counter + 'Zip" id="w' + $counter + 'Zip" type="text" placeholder="Zip code" class="mediumInput">' +
                    '<input name="w' + $counter + 'HomePhoneNum" id="w' + $counter + 'HomePhoneNum" type="tel" placeholder="Phone number">' +
                    '<input name="w' + $counter + 'CellPhoneNum" id="w' + $counter + 'CellPhoneNum" type="tel" placeholder="Cell number">' +
                    '<input name="w' + $counter + 'City" id="w' + $counter + 'City" type="hidden">' +
                    '<input name="w' + $counter + 'State" id="w' + $counter + 'State" type="hidden">' +
                    '<br>' +
                    '<hr>' +
                    '<br>';
     $div.innerHTML = $line;
     $witnesses.appendChild($div);
     var $witnessZip = ("w" + $counter + "Zip");
     var $sendZip = ("w" + $counter);
     var $city = ("w" + $counter + "City");
     var $state = ("w" + $counter + "State");
     document.getElementById($witnessZip).onchange = function() {
          populateCityState(document.getElementById($witnessZip).value);
          document.getElementById($city).value = $cityState[0];
          document.getElementById($state).value = $cityState[1];
          $counter++;
          handleWitnesses($counter);
     }
}

window.onload = function() {
     createCityStateData();
     loadCityStates("patient");
     setLocation();
     setAge();
     document.getElementById("dateComplete").value = setDate();
     setHelmet();
     setLocation();
     setGlasses();
     setInstructor();
     setOther();
     setEquipOther();
     setRental();
     loadPatrollers('scenePatrollers',0);
     loadPatrollers('transportingPatrollers',0);
     loadPatrollers('aidRoomPatrollers',0);
     loadPatrollers('reportCompleter',0);
     handleWitnesses(0);
     document.getElementById("date").value = setDate();
     document.getElementById("day").value = setWeekDayString();
     $(document).load().scrollTop(0); //ensure page starts at top
};


/*
 *Helpful URLs:
 *
 *http://stackoverflow.com/questions/6601952/programmatically-create-select-list
 *
 *http://stackoverflow.com/questions/5805059/select-placeholder/5859221#5859221 - 2nd answer!
 *
 *http://stackoverflow.com/questions/3664381/html-force-page-scroll-position-to-top-at-page-refresh/3664406#3664406 - 2nd answer
 *
 *http://stackoverflow.com/questions/629614/how-to-get-the-child-node-in-div-using-javascript
 *
 *http://stackoverflow.com/questions/4641962/getting-an-option-text-value-with-javascript
 *
 *
 */
