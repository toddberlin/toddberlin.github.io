var inputElement = document.getElementById('fileItem');
var outputDiv = document.getElementById("velocity-output");

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

function generateOutput(data) {
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
  outputToDom(velOutput, unitsSummary);
}


function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}
function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  console.log("onReaderLoad function");
  generateOutput(obj);
}

inputElement.addEventListener('change', onChange);
