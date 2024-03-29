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

// generate both Velocity and csv output
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
  //output marketo velocity
  //outputToDom(velOutput, unitsSummary);

  //build csv data
  var csvOutput = [];
  velOutput.forEach(function(emp) {
    var ujData = [];
    emp.Apprentices.forEach(function(app){
      var appUnits = [];
      app.units.forEach(function(unit) {
        appUnits.push({"unit_code": unit, "unit_title": unitsSummary.find(o => o["code"] === unit).title });
      });
      ujData.push({"apprentice_name": app.name, "units": appUnits});
    });
    csvOutput.push({"Email": emp.Email, "Miscellaneous JSON Data 1": `${JSON.stringify(ujData)}`}); // 
    //console.log(csvOutput);
  });
  
  //download new csv

  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + Papa.unparse(csvOutput, {
    skipEmptyLines: true
  });
  hiddenElement.target = '_blank';
  hiddenElement.download = 'uj-data--apprentices-per-employer.csv';
  hiddenElement.click();
  
}

document.getElementById('the_file').addEventListener('change', fileInfo, false);

document.getElementById('the_form_submit').addEventListener('click', () => {
  Papa.parse(document.getElementById('the_file').files[0],{
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      generateOutput(results.data);
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