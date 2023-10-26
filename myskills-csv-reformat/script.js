function generateOutput(uploadedData) {

  var mySkillsOutput = []; // data built in this to pass to csv generator
  var dualQualsExcluded = []; // data added here for duals and triples to alert the user
  let myTable = document.querySelector('#duals-output');
  let tHeaders = ["Course code", "Course title", "Course url", "Workload", "Locations", "Study modes", "Full fee"];
  var source = uploadedData;
  var outputDiv = document.getElementById("csv-data");

  for (var i = 0; i < source.length; i++) { //
    var courseCode = source[i]["Course Code"];
    var courseID = source[i]["Course ID"];
    var courseFolder = String(courseID).slice(0, 2);
    var courseTitle = source[i]["Course Title"];
    var courseWorkload = source[i]["Workload"];
    var thisFullFee = parseInt(source[i]["Full fee"]) || 0;
    var courseTitleURL = courseTitle.toLowerCase().replace(/(\(|\)|,|\.|\/|\[|\])/g, '').replace(/\s+/g, "-")
      .replace(/-+/g, "-"); //
    var courseLocation = source[i]["Location"];
    var courseStudyMode = source[i]["Study Mode"];
    var courseDeliveryMode = source[i]["Delivery Mode"]; 
    var courseURL = `https://tafeqld.edu.au/course/${courseFolder}/${courseID}/${courseTitleURL}`;
    var levelsReg = /^(?!(MCC|NONAC|SS|UNL|Units from |UNILEARN).*$).*/;
    var wtsPublish = source[i]["Publish"] == "Yes";

    // filter quals 
    if (levelsReg.test(courseCode) && wtsPublish && !courseTitle.includes('Associate Degree') && !courseTitle.includes('Bachelor') && !courseCode.includes('/') ) { 
    //  if(courseCode == "AHC20416") {
      if (mySkillsOutput.find(o => o["course code"] === courseCode)) { // check for existing ones 
        var existingCourse = mySkillsOutput.find(o => o["course code"] === courseCode); 
        var existingFullFee = parseInt(existingCourse["full fee"]);

        if (thisFullFee > existingFullFee) {
          existingCourse["full fee"] = thisFullFee;
        } 
        if (!existingCourse.locations.includes(courseLocation)) { //pushes location only hasn't already been added 
          existingCourse.locations.push(courseLocation);
        }
        if (!existingCourse["study modes"].includes(courseStudyMode)) {
          existingCourse["study modes"].push(courseStudyMode);
        }
        if (!existingCourse["delivery modes"].includes(courseDeliveryMode)) {
          existingCourse["delivery modes"].push(courseDeliveryMode);
        }
        if (courseWorkload && !existingCourse.workload.includes(courseWorkload)) { //pushes location only hasn't already been added 
          existingCourse.workload.push(courseWorkload);
        }
      } else { // add new one if not
        mySkillsOutput.push({
          "course code": courseCode,
          "course title": courseTitle,
          "course url": courseURL,
          "workload": [courseWorkload],
          "locations": [courseLocation],
          "delivery modes": [courseDeliveryMode],
          "study modes": [courseStudyMode],
          "full fee": thisFullFee
        });
      }//////////////////////////////////////////////////////
    } else if (courseCode.includes('/')) {
      if (dualQualsExcluded.find(o => o["course code"] === courseCode)) { // check for existing ones 
        var existingCourse = dualQualsExcluded.find(o => o["course code"] === courseCode); 
        var existingFullFee = parseInt(existingCourse["full fee"]);

        if (thisFullFee > existingFullFee) {
          existingCourse["full fee"] = thisFullFee;
        } 
        if (!existingCourse.locations.includes(courseLocation)) { //pushes location only hasn't already been added 
          existingCourse.locations.push(courseLocation);
        }
        if (!existingCourse["study modes"].includes(courseStudyMode)) {
          existingCourse["study modes"].push(courseStudyMode);
        }
        if (courseWorkload && !existingCourse.workload.includes(courseWorkload)) { //pushes location only hasn't already been added 
          existingCourse.workload.push(courseWorkload);
        }
      } else { // add new one if not
        dualQualsExcluded.push({
          "course code": courseCode,
          "course title": courseTitle,
          "course url": courseURL,
          "workload": [courseWorkload],
          "locations": [courseLocation],
          "study modes": [courseStudyMode],
          "full fee": thisFullFee
        });
      }
    }
    
  }

  $('#duals-output-table').DataTable( {
    data: dualQualsExcluded,
    responsive: true,
    columns: [
      { data: 'course code', title: "Course code" },
      { data: 'course title', title: "Course title" },
      { data: 'course url', title: "Course URL" },
      { data: 'workload', title: "Workloads" },
      { data: 'locations', title: "Locations" },
      { data: 'study modes', title: "Study modes" },
      { data: 'full fee', title: "Highest full fee" }
    ],
    buttons: ['copyHtml5'],
    paging: false,
    searching: false,
    scrollY: 600,
    scrollX: true
  } );
  //console.log(mySkillsOutput);
  mapMySkillsData(mySkillsOutput);
}

///////////////////////////////////////////////////// OLD
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
      `"${course['course code']}",${course['full fee']},"","",${workloadSelection}${studymodeSelection}"","${offeredHeadOffice}",${locationSelection}"${course['course url']}"\n`;

    csv += addLine;
    
  });

  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'myskills_update.csv';
  hiddenElement.click();
}
///////////////////////////////////////////////////// OLD


function mapMySkillsData(data) {
  /*var csv =
    '"Course Code","Tuition Fee","Duration Number","Duration Type","Available Part-Time","Available Online","Offsite Delivery Available","Block Training Available","Course and Additional Fees Information","Offered at Head Office","Offer at: Acacia Ridge (Location ID: 38087)","Offer at: Aitkenvale (Location ID: 36633)","Offer at: Alexandra Hills (Location ID: 35213)","Offer at: Ashmore (Location ID: 36666)","Offer at: Atherton (Location ID: 36632)","Offer at: Bowen (Location ID: 36634)","Offer at: Bracken Ridge (Location ID: 35702)","Offer at: Browns Plains (Location ID: 36658)","Offer at: Bundaberg (Location ID: 36659)","Offer at: Bundamba (Location ID: 36648)","Offer at: Burdekin (Location ID: 36635)","Offer at: Caboolture  (Location ID: 35703)","Offer at: Cairns (Location ID: 36636)","Offer at: Cairns - Great Barrier Reef International Marine College (Location ID: 36637)","Offer at: Charters Towers (Location ID: 36638)","Offer at: Chinchilla (Location ID: 36649)","Offer at: Cloncurry (Location ID: 36639)","Offer at: Coolangatta (Location ID: 36667)","Offer at: Coomera (Location ID: 36668)","Offer at: Dalby (Location ID: 36650)","Offer at: Eagle Farm (Location ID: 38088)","Offer at: Grovely (Location ID: 35704)","Offer at: Gympie (Location ID: 36660)","Offer at: Hervey Bay (Location ID: 36661)","Offer at: Inala (Location ID: 36651)","Offer at: Ingham (Location ID: 36640)","Offer at: Innisfail (Location ID: 36641)","Offer at: Kingaroy (Location ID: 36652)","Offer at: Loganlea (Location ID: 35705)","Offer at: Maroochydore (Location ID: 36662)","Offer at: Maryborough (Location ID: 36663)","Offer at: Mooloolaba (Location ID: 36664)","Offer at: Mount Gravatt  (Location ID: 35706)","Offer at: Mount Isa (Location ID: 36642)","Offer at: Nambour (Location ID: 36665)","Offer at: Normanton (Location ID: 36643)","Offer at: Nurunderi (Location ID: 36653)","Offer at: Palm Island (Location ID: 36644)","Offer at: Redcliffe (Location ID: 35707)","Offer at: Roma (Location ID: 36654)","Offer at: Southbank (Location ID: 35212)","Offer at: Southport (Location ID: 36669)","Offer at: Springfield (Location ID: 36655)","Offer at: The Whitsundays (Location ID: 36645)","Offer at: Thursday Island (Location ID: 36646)","Offer at: Toowoomba (Location ID: 36656)","Offer at: Townsville (Location ID: 36647)","Offer at: Trade Training Centre (Location ID: 36631)","Offer at: Warwick (Location ID: 36657)","RTO Course URL"\n';
    */

  var courseData = [];
  data.forEach(function (course) {
    var currentCourse = {};
    var offeredHeadOffice = course.locations.length > 0 ? "Y" : "N";

    var workloadSelection = "N"; 
    if (course.workload.some(x => x.toLowerCase().includes("part time"))) {
      workloadSelection = "Y";
    } 
    var onlineSelection = "N"; 
    if (course["delivery modes"].some(x => x.toLowerCase().includes("online"))) {
      onlineSelection = "Y";
    } 
    var offsiteSelection = "N"; 
    if (course["study modes"].some(x => x.toLowerCase().includes("mixed mode")) || course["delivery modes"].some(x => x.toLowerCase().includes("workplace"))) {
      offsiteSelection = "Y";
    } 
    var blockSelection = "N"; 
    if (course["study modes"].some(x => x.toLowerCase().includes("block"))) {
      blockSelection = "Y";
    } 

    // add summarised course data in order
    currentCourse["Course Code"] = course["course code"];
    currentCourse["Tuition Fee"] = course["full fee"];
    currentCourse["Duration Number"] = "";
    currentCourse["Duration Type"] = "";
    currentCourse["Available Part-Time"] = workloadSelection;
    currentCourse["Available Online"] = onlineSelection;
    currentCourse["Offsite Delivery Available"] = offsiteSelection;
    currentCourse["Block Training Available"] = blockSelection;
    currentCourse["Course and Additional Fees Information"] = "";
    currentCourse["Offered at Head Office"] = offeredHeadOffice;

    // add campuses
    mySkillsLocations2.forEach(function(location) {
      //console.log(location.mySkillsLabel);
      currentCourse[location.mySkillsLabel] = course.locations.some(x => x.includes(location.tqOneLabel)) ? "Y" : "N";
    });

    currentCourse["RTO Course URL"] = course["course url"];
    
    courseData.push(currentCourse);



//////////////////////////////////////////////////////////////////////////////////////////////////////
    var locationSelection = ""; // all delivery locations

    //set all locations as per what exists in MySkills - in output-table-reference.js file
    mySkillsLocations.forEach(function (MSLocation) {
      var addLocation = course.locations.includes(MSLocation) ? '"Y",' : '"N",';
      locationSelection += addLocation;
    });
//////////////////////////////////////////////////////////////////////////////////////////////////////

  });

  console.log(courseData);
  
  
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + Papa.unparse(courseData, {
    skipEmptyLines: true
  });
  hiddenElement.target = '_blank';
  hiddenElement.download = 'myskills-formatted-data.csv';
  hiddenElement.click();
  
}

document.getElementById('fileItem').addEventListener('change', () => {
  Papa.parse(document.getElementById('fileItem').files[0],{
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results){
      generateOutput(results.data);
    }
  });
});