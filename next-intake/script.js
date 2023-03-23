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
  //outputToDom(velOutput, unitsSummary);
}

function formatWtsData(inputData) {
  var outputData = [];
  // Course ID, Course Code, Course Title, Course Sub Title, Website URL, [Delivery Mode, Region, Location, Start Date, Starts Anytime]
  // Course Status: Active, Internal use only: No, Show on Internet: Yes, Status: Admission||Open, 

  for (i=0; i<inputData.length; i++) {

    var courseID = inputData[i]["Course ID"];
    var courseCode = inputData[i]["Course Code"];
    var courseTitle = inputData[i]["Course Title"];
    var courseSubTitle = inputData[i]["Course Sub Title"];
    var courseURL = inputData[i]["Website URL"];
    var location = inputData[i]["Location"];
/*    var courseLocation = inputData[i]["Location"];
    var courseStudyMode = inputData[i]["Study Mode"];*/
    
    //console.log(wtsPublish || !courseStatus || internalOnly || showOnInternet || !wtsStatus);
    if (inputData[i]["Publish"] == "No") {continue}
    if (!inputData[i]["Course Status"] == "Active") {continue}
    if (inputData[i]["Internal use only"] == "Yes") {continue}
    if (inputData[i]["Show on Internet"] == "No") {continue}
    if (!(inputData[i]["Status"] == "Admission" || inputData[i]["Status"] == "Open")) {continue}

   // console.log(inputData[i]["WTS Unique Identifier"]);


    if (outputData.find(o => o["course id"] === courseID)) { // check for existing ones 
      var existingCourse = outputData.find(o => o["course id"] === courseID); 
      existingCourse.locations.push(location);
      /*if (!existingCourse["study modes"].includes(courseStudyMode)) {
        existingCourse["study modes"].push(courseStudyMode);
      }*/
    } else {
      outputData.push({
        "course id": courseID,
        "course code": courseCode,
        "course title": courseTitle,
        "course sub title": courseSubTitle,
        "course url": courseURL,
        "locations": [location]
      });
    }
  }
  
  console.log(outputData);
  return outputData;
}


// handle form submit
document.getElementById('the_form_submit').addEventListener('click', () => {
  var leadData = [];
  var wtsData;

  // lead data
  /*Papa.parse(document.getElementById('the_file').files[0],{
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      leadData.push(results.data);
    }
  });*/

  // wts data
  Papa.parse(document.getElementById('the_course_data').files[0],{
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      wtsData = formatWtsData(results.data);
    }
  });
  //console.log(wtsData);
});







// outputs file name in dom
/*function fileInfo(e) {
  var file = e.target.files[0];
  if (file.name.split(".")[1].toUpperCase() != "CSV") {
    alert('Invalid csv file !');
    e.target.parentNode.reset();
    return;
  } else {
    //console.log(this);
    this.innerHTML = "<p>File Name: " + file.name + " | " + file.size + " Bytes.</p>";
  }
}*/

//var inputElement = document.getElementById('the_file');
//var outputDiv = document.getElementById("velocity-output");

/*
function outputToDom(refactoredData, referenceList) {
  var unitsRefOutput = JSON.stringify(referenceList, null, 2);
  var objectOutput= JSON.stringify(refactoredData, null, 2);
  //outputDiv.innerText = "#set( $allUnits = " + unitsRefOutput + " ) \n"+ "#set( $employerData = " + objectOutput + " )";

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
*/


/*
function onChange(event) {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
}
function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  generateOutput(obj);
}*/

//document.getElementById('the_file').addEventListener('change', fileInfo, false);
//document.getElementById('the_course_data').addEventListener('change', fileInfo, false);

/**************** auto select */
/*function SelectText(element) {
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
});*/