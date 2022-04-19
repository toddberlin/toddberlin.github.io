function generateOutput(uploadedData) {

  var mySkillsOutput = [];
  var source = uploadedData;
  var outputDiv = document.getElementById("csv-data");

  for (var i = 0; i < source.length; i++) { //
    var courseCode = source[i]["Course Code"];
    var courseID = source[i]["Course ID"];
    var courseFolder = courseID.slice(0, 2);
    var courseTitle = source[i]["Course Title"];
    var courseWorkload = source[i]["Workload"];
    var courseTitleURL = courseTitle.toLowerCase().replace(/(\(|\)|,|\.|\/|\[|\])/g, '').replace(/\s+/g, "-")
      .replace(/-+/g, "-"); //
    var courseLocation = source[i]["Location"];
    var courseStudyMode = source[i]["Study Mode"];
    var courseURL = `https://tafeqld.edu.au/course/${courseFolder}/${courseID}/${courseTitleURL}`;
    var levelsReg = /^(?!(MCC|NONAC|SS|UNL|Units from |UNILEARN).*$).*/;

    // filter quals 
    if (levelsReg.test(courseCode) && !courseTitle.includes('Associate Degree') && !courseTitle.includes('Bachelor') && !courseCode.includes('/') ) { 
      if (mySkillsOutput.find(o => o["course code"] === courseCode)) { // check for existing ones
        var existingCourse = mySkillsOutput.find(o => o["course code"] === courseCode);
        if (!existingCourse.locations.includes(courseLocation)) {
          existingCourse.locations.push(courseLocation)
        }
        if (!existingCourse["study modes"].includes(courseStudyMode)) {
          existingCourse["study modes"].push(courseStudyMode);
        }
      } else { // add new one if not
        mySkillsOutput.push({
          "course code": courseCode,
          "course title": courseTitle,
          "course url": courseURL,
          "workload": courseWorkload,
          "locations": [courseLocation],
          "study modes": [courseStudyMode]
        });
      }
    }
  }
  generateCSVFile(mySkillsOutput);
}

function generateCSVFile(data) {
  var csv =
    '"Course Code","Tuition Fee","Duration Number","Duration Type","Available Part-Time","Available Online","Offsite Delivery Available","Block Training Available","Course and Additional Fees Information","Offered at Head Office","Offer at: Acacia Ridge (Location ID: 38087)","Offer at: Aitkenvale (Location ID: 36633)","Offer at: Alexandra Hills (Location ID: 35213)","Offer at: Ashmore (Location ID: 36666)","Offer at: Atherton (Location ID: 36632)","Offer at: Bowen (Location ID: 36634)","Offer at: Bracken Ridge (Location ID: 35702)","Offer at: Browns Plains (Location ID: 36658)","Offer at: Bundaberg (Location ID: 36659)","Offer at: Bundamba (Location ID: 36648)","Offer at: Burdekin (Location ID: 36635)","Offer at: Caboolture  (Location ID: 35703)","Offer at: Cairns (Location ID: 36636)","Offer at: Cairns - Great Barrier Reef International Marine College (Location ID: 36637)","Offer at: Charters Towers (Location ID: 36638)","Offer at: Chinchilla (Location ID: 36649)","Offer at: Cloncurry (Location ID: 36639)","Offer at: Coolangatta (Location ID: 36667)","Offer at: Coomera (Location ID: 36668)","Offer at: Dalby (Location ID: 36650)","Offer at: Eagle Farm (Location ID: 38088)","Offer at: Grovely (Location ID: 35704)","Offer at: Gympie (Location ID: 36660)","Offer at: Hervey Bay (Location ID: 36661)","Offer at: Inala (Location ID: 36651)","Offer at: Ingham (Location ID: 36640)","Offer at: Innisfail (Location ID: 36641)","Offer at: Kingaroy (Location ID: 36652)","Offer at: Loganlea (Location ID: 35705)","Offer at: Maroochydore (Location ID: 36662)","Offer at: Maryborough (Location ID: 36663)","Offer at: Mooloolaba (Location ID: 36664)","Offer at: Mount Gravatt  (Location ID: 35706)","Offer at: Mount Isa (Location ID: 36642)","Offer at: Nambour (Location ID: 36665)","Offer at: Normanton (Location ID: 36643)","Offer at: Nurunderi (Location ID: 36653)","Offer at: Palm Island (Location ID: 36644)","Offer at: Redcliffe (Location ID: 35707)","Offer at: Roma (Location ID: 36654)","Offer at: Southbank (Location ID: 35212)","Offer at: Southport (Location ID: 36669)","Offer at: Springfield (Location ID: 36655)","Offer at: The Whitsundays (Location ID: 36645)","Offer at: Thursday Island (Location ID: 36646)","Offer at: Toowoomba (Location ID: 36656)","Offer at: Townsville (Location ID: 36647)","Offer at: Trade Training Centre (Location ID: 36631)","Offer at: Warwick (Location ID: 36657)","RTO Course URL"\n';

  data.forEach(function (course) {
    var studymodeSelection = ""; // online, offsite, block
    var locationSelection = ""; // all delivery locations
    var offeredHeadOffice = course.locations.length > 0 ? "Y" : "N";
    var workloadSelection = ""; // part time 

    //set all locations as per what exists in MySkills - in output-table-reference.js file
    mySkillsLocations.forEach(function (MSLocation) {
      var addLocation = course.locations.includes(MSLocation) ? '"Y",' : '"N",';
      locationSelection += addLocation;
    });
    
    // set PART TIME for each course
    //mySkillsWorkloads.forEach(function(MSWorkloadCategory) {
      var workloadMatch = function (el) {
        return course["workload"].includes(el);
      };
      if (!mySkillsWorkloads.some(workloadMatch)) {
        workloadSelection += '"Y",';
      } else {
        workloadSelection += '"N",';
      }
    //});

    // set other three workloads/study modes
    mySkillsModes.forEach(function(MSModeCategory) { //
      var modeMatch = function (el) {
        return course["study modes"].includes(el);
      };
      if (MSModeCategory.some(modeMatch)) {
        studymodeSelection += '"Y",';
      } else {
        studymodeSelection += '"N",';
      }
    });

    var addLine =
      `"${course['course code']}","0","","",${workloadSelection}${studymodeSelection}"","${offeredHeadOffice}",${locationSelection}"${course['course url']}"\n`;

    csv += addLine;
    
  });

  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'myskills_update.csv';
  hiddenElement.click();
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

document.getElementById('fileItem').addEventListener('change', onChange);
