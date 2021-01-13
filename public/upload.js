let empire = null;

const fileEmpire = document.getElementById("fileEmpire");

function onChange(event) {
  const reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
  // fileSelect.innerHTML = event.target.files[0].name;
}

function onReaderLoad(event){
  console.log(event.target.result);
  empire = JSON.parse(event.target.result);
  // alert_data(obj.name, obj.family);
}

// fileSelect.addEventListener("click", function (e) {
//   if (fileEmpire) {
//     fileEmpire.click();
//   }
// }, false);

fileEmpire.addEventListener('change', onChange);
