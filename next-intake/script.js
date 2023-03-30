var domOutput = document.getElementById("output");

function formatWtsData(inputData) {
  var outputData = [];
  // Course ID, Course Code, Course Title, Course Sub Title, Website URL, [Delivery Mode, Region, Location, Start Date, Starts Anytime]
  // Course Status: Active, Internal use only: No, Show on Internet: Yes, Status: Admission||Open, 

  for (i=0; i<inputData.length; i++) {
    // set course variables
    var courseID = inputData[i]["Course ID"];
    var courseCode = inputData[i]["Course Code"];
    var courseTitle = inputData[i]["Course Title"];
    var courseSubTitle = inputData[i]["Course Sub Title"];
    var courseURL = inputData[i]["Website URL"];
    var thisLocation = inputData[i]["Location"];
    //var startDate = inputData[i]["Start Date"];
    var startDate = inputData[i]['Displays as starts "any_time"'] == "Yes" ? "Starts anytime" : inputData[i]["Start Date"]; // Displays as starts "any_time" 
    
    // exit if wts not good
    if (inputData[i]["Publish"] == "No") {continue}
    if (!inputData[i]["Course Status"] == "Active") {continue}
    if (inputData[i]["Internal use only"] == "Yes") {continue}
    if (inputData[i]["Show on Internet"] == "No") {continue}
    if (!(inputData[i]["Status"] == "Admission" || inputData[i]["Status"] == "Open")) {continue}
    
    if (outputData.find(o => o["course id"] === courseID)) { // find existing course
      var existingCourse = outputData.find(o => o["course id"] === courseID); 
      if (existingCourse.locations.hasOwnProperty(thisLocation)) { // add start date to exisiting location
        existingCourse.locations[thisLocation].push(startDate);
      } else { // create location and add start date
        existingCourse.locations[thisLocation] = [startDate];
      }
    } else { // create new course if not exists
      outputData.push({
        "course id": courseID,
        "course code": courseCode,
        "course title": courseTitle,
        "course sub title": courseSubTitle,
        "course url": courseURL,
        "locations": {
          [thisLocation] : [ startDate ]
        }
      });
    }
  }
  return outputData;
}


// generate output
function generateCSVFile(courseData, leadData) {
  if (!courseData.length || !leadData.length) {return};

  var csv = [];
  var csvDump = [];

  leadData.forEach(function (lead) {
    var leadNextIntakes = "";
    var leadsCourse = courseData.find(o => o["course id"] === lead["TQOne ID"]);
    
    // exit if the course or campus doesn't exist
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

    // var addLine = `"${lead['Email']}",${lead['First name']},${lead['Last name']},${lead['Student number']},${leadsCourse["course url"]},${lead['Campus']},${leadNextIntakes[0]}\n`;

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

  var nonMatchesElement = document.createElement('a');
  nonMatchesElement.href = 'data:text/csv;charset=utf-8,' + Papa.unparse(csvDump, {
    skipEmptyLines: true
  });
  nonMatchesElement.target = '_blank';
  nonMatchesElement.download = 'next-intake--non-matches.csv';
  nonMatchesElement.click();

}

var leadData = [];
var wtsData = [];

function setLeadData(data) {
  leadData = data;
  if (wtsData.length) { 
    generateCSVFile(wtsData, leadData);
  }
}
function setCourseData(data) {
  wtsData = data;
  if (leadData.length) {
    generateCSVFile(wtsData, leadData);
  }
}

function parseLeadData(input, callBack) {
  Papa.parse(input, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      callBack(results.data);
    }
  });
}
function parseCourseData(input, callBack) {
  Papa.parse(input, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      callBack(formatWtsData(results.data));
    }
  });
}

// handle form submit
document.getElementById('the_form_submit').addEventListener('click', function() {
  parseLeadData(document.getElementById('the_file').files[0], setLeadData);
  parseCourseData(document.getElementById('the_course_data').files[0], setCourseData);  
  
  //generateCSVFile(wtsData, leadData);
});