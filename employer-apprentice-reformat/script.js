function fileInfo(e) {
  var file = e.target.files[0];
  if (file.name.split(".")[1].toUpperCase() != "CSV") {
    alert('Invalid csv file !');
    e.target.parentNode.reset();
    return;
  } else {
    document.getElementById('file_info').innerHTML = "<p>File Name: " + file.name + " | " + file.size +
      " Bytes.</p>";
  }
}

var outputDiv = document.getElementById("velocity-output");





/*
// generate output 
function generateCSVDownload(data) {
  //if both not filled yet, exit 
  if (!data.length || !leadData.length) {return};

  var csv = [];
  var csvDump = [];

  leadData.forEach(function (lead) {
    var leadNextIntakes = "";
    var leadsCourse = data.find(o => o["course id"] === lead["TQOne ID"]);
    
    // exit if the course or campus doesn't exist, add to DUMP array
    if (!leadsCourse || !leadsCourse.locations.hasOwnProperty(lead["Campus"])) {
      csvDump.push(lead);
      return; 
    }

    // get next intake date for course & campus
    leadNextIntakes = leadsCourse.locations[lead["Campus"]].sort(function (a, b) {
      var dateA = new Date(a),
        dateB = new Date(b);
      if (dateB > dateA) {
        return -1;
      } else {
        return 1;
      }
    });
    
    // add to 'csv' keeper array with next date
    var newLead = lead;
    newLead["Next intake date"] = leadNextIntakes[0];
    csv.push(newLead);
  });
  
  
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + Papa.unparse(csv, {
    skipEmptyLines: true
  });
  hiddenElement.target = '_blank';
  hiddenElement.download = 'next-intake.csv';
  hiddenElement.click();

  //domOutput.innerHTML = Papa.unparse(csvDump);
}
*/



function outputToDom(refactoredData, referenceList) {
  var unitsRefOutput = JSON.stringify(referenceList, null, 2);
  var objectOutput= JSON.stringify(refactoredData, null, 2);
  outputDiv.innerText = "#set( $allUnits = " + unitsRefOutput + " ) \n"+ "#set( $employerData = " + objectOutput + " )";

  function selectElementText(el, win) {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
  }
  selectElementText(outputDiv);
  outputDiv.scrollIntoView();
}








function generateVelocityOutput(data) {
  var unitsSummary = [];
  var velOutput = [];

  for (var i = 0; i < data.length; i++) { // looping through all uploaded data
    var empEmail = data[i]["Employer Email"];
    var apprentice = data[i]["Student Name"];
    var unitCode = data[i]["Unit Code"];
    var unitTitle = data[i]["Unit Study Package Full Title"];

    if (velOutput.find(o => o["Email"] === empEmail)) { // check for existing emplployers 
      var existingEmployer = velOutput.find(o => o["Email"] === empEmail); 
      
      if (existingEmployer.Apprentices.find(o => o["name"] === apprentice)) { // check for apprentice and add unit only
        var existingApprentice = existingEmployer.Apprentices.find(o => o["name"] === apprentice);
        existingApprentice.units.push(unitCode);
      } else { // if new apprentice add new
        existingEmployer.Apprentices.push({"name":apprentice, "units": [unitCode]});
      }

    } else { // add new employer if not exists
      velOutput.push({
        "Email": empEmail,
        "Apprentices": [{
          "name": apprentice,
          "units": [unitCode]
        }]
      });
    }

    if (!unitsSummary.find(o => o["code"] === unitCode)) { // add unit to unitsSummary if not exists
      unitsSummary.push({
        "code": unitCode,
        "title": unitTitle
      });
    }
  }
  //output marketo velocity
  outputToDom(velOutput, unitsSummary);

  //build csv data
  var csvOutput = [];
  velOutput.forEach(function(emp) {
    var ujData = [];
    emp.Apprentices.forEach(function(app){
      var appUnits = [];
      app.units.forEach(function(unit) {
        appUnits.push({"unit_code": unit, "unit_title": unitsSummary.find(o => o["code"]).title});
      });
      ujData.push({"apprentice_name": app.name, "units": appUnits});
    });
    csvOutput.push({"Email": emp.Email, "Miscellaneous JSON Data 1": ujData});
  });

  //console.log(csvOutput);
  
  //download new csv
 var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + Papa.unparse(csvOutput, {
    skipEmptyLines: true
  });
  hiddenElement.target = '_blank';
  hiddenElement.download = 'next-intake.csv';
  hiddenElement.click();
}

//{
//	"apprentice_name": "Sammi B",
//	"units": [{
//			"unit_code": "CPCPCM2053",
//			"unit_title": "Weld using metal arc welding equipment"
//		},
//		{
//			"unit_code": "CPCCCA3018",
//			"unit_title": "Construct, erect and dismantle formwork for stairs and ramps"
//		}
//	]
//}







document.getElementById('the_file').addEventListener('change', fileInfo, false);

document.getElementById('the_form_submit').addEventListener('click', () => {
  Papa.parse(document.getElementById('the_file').files[0],{
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      generateVelocityOutput(results.data);
      //generateCSVDownload(results.data);
    }
  });
});

/**************** auto select */
function SelectText(element) {
  var text = element,
      range,
      selection;
  if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
  } else if (window.getSelection) {
      selection = window.getSelection();        
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
  }
}

document.querySelector('.autoselect').addEventListener('click', function() {
  SelectText(this);
});