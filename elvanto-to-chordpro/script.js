const inputEl = document.querySelector(".input");

var replaceables = [
  {
    'regex': '^ *',
    'replacement': ''
  },{
    'regex': '^\\*',
    'replacement': '{comment: '
  }, {
    'regex': '(?<!^)\\*',
    'replacement': '}'
  }
];

inputEl.addEventListener("input", function() {

  var inputText = inputEl.value;
  var outputText = inputText;
      
  replaceables.forEach(function(replace) {
    var find = new RegExp(replace.regex, 'gm');
    // console.log(findThis);
    outputText = outputText.replace(find, replace.replacement);
  });
  
  document.querySelector(".output").value = outputText;
});

function copyToClipboard(element) {
  var tempInput = document.createElement("textarea");
  document.body.appendChild(tempInput);
  tempInput.value = element.value;
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
}

document.getElementById('copy').addEventListener('click', function() {
  copyToClipboard(document.getElementById('output'));
});