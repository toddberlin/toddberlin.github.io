var inputElement = document.getElementById('fileItem');
var outputDiv = document.getElementById("velocity-output");

function outputToDom(refactoredData) {
  outputDiv.innerText = JSON.stringify(refactoredData, null, 2);
}

function generateOutput(data) {
  var velOutput = [];

  for (var i = 0; i < data.length; i++) { // looping through all uploaded data
    var empEmail = data[i]["Employer Email"];
    var apprentice = data[i]["Student Name"];
    var unitCode = data[i]["Unit Code"];
    var unitTitle = data[i]["Unit Study Package Full Title"];

//    velOutput += `${empEmail} ${apprentice} ${unitCode} ${unitTitle}`;

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
  }
  outputToDom(velOutput);
}


function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}
function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  generateOutput(obj);
}

inputElement.addEventListener('change', onChange);
