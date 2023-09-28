'use strict';

const importBtn = document.getElementById('import-btn');
const exportBtn = document.getElementById('export-btn');
const fileInput = document.getElementById('input-file');

let petArr = JSON.parse(getFromStorage('petArr')) || [];
let petExport = JSON.stringify(petArr);
let petImport;

//==========================================
///////////  FUNCTIONS  ///////////
//==========================================

///////////////////////////////////
// Function: Format pet string
const formatString = function (str) {
  str = str.split(',').join(',\n');
  str = str.split('}').join('\n}');
  str = str.split('{').join('{\n');
  return (str = str.split('},\n{').join('}, {'));
};
petExport = formatString(petExport);

////////////////////////////////////
// Function: Save data to file
function savePetDataToFile() {
  const blob = new Blob([petExport], {
    type: 'text/plain;charset=utf-8',
  });
  saveAs(blob, 'Pet-data.json');
}

//==========================================
////////// EVENT HANDLERS //////////
//==========================================

///////////////////////////////////
// CLICK IMPORT BUTTON
importBtn.addEventListener('click', function (e) {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (e) {
      // Save imported pets
      petImport = JSON.parse(e.target.result);
      //  Remove duplicates from  petArr (compare with petImport array)
      petArr = petArr.filter(
        pet => !petImport.some(petImp => petImp.id === pet.id)
      );
      // Adding import pets to current pets
      petArr = petArr.concat(petImport);
      // Save petArr to local Storage
      saveToStorage('petArr', JSON.stringify(petArr));
    };
    reader.onerror = function (e) {
      console.log('error reading file');
    };
    // Alert when import file successfully
    alert('Successfully import!');
    document.getElementById('input-file').value = '';
  } else {
    // Alert when no files are uploaded
    alert('Please choose a file!');
  }
});
///////////////////////////////////
// CLICK EXPORT BUTTON
exportBtn.addEventListener('click', savePetDataToFile);
