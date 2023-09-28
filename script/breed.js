'use strict';

const inputBreed = document.getElementById('input-breed');
const inputType = document.getElementById('input-type');
const btnSubmitBreed = document.getElementById('submit-btn-breed');
const tableBodyBreed = document.getElementById('tbody');
const breedArr = JSON.parse(getFromStorage('breedArr')) || [];

//==========================================
///////////  FUNCTIONS  ///////////
//==========================================

////////////////////////////////////
// Function: render breed table
const renderBreedTable = function (arr) {
  tableBodyBreed.innerHTML = '';
  arr.forEach((breed, i) => {
    const htmlRow = document.createElement('tr');
    htmlRow.innerHTML = `
  <td scope="col"> ${i + 1}</td>
  <td scope="col">${breed.name}</td>
  <td scope="col">${breed.type}</td>
  <td scope="col"><button type="button" class="btn btn-danger btn-delete" data-breed-index=${i} >Delete</button></td>
  `;
    tableBodyBreed.appendChild(htmlRow);
  });
};
////////////////////////////////////
// Function:  Validate breed data input
const validateBreed = function (data) {
  let check = false;
  // check if breed is already exist
  const breedAlreadyExist = breedArr.some(
    breed => data.name === breed.name && data.type === breed.type
  );
  // Check if empty inputs
  if (!data.name) {
    alert('Please input Breed!');
    // Check if type is not selected
  } else if (data.type === 'Select Type') {
    alert('Pleas select type');
    // Alert if breed is already exist
  } else if (breedAlreadyExist) {
    alert('Breed and type are already exist!');
    // All inputs are valid
  } else {
    check = true;
  }
  return check;
};
////////////////////////////////////
// Function: Clear inputs
const clearBreedInput = function () {
  inputBreed.value = '';
  inputType.value = 'Select Type';
};
////////////////////////////////////
// Function: Delete Breed
const deleteBreed = function (e) {
  if (e.target.classList.contains('btn-delete')) {
    if (confirm('Are your sure?')) {
      const index = e.target.dataset.breedIndex;
      breedArr.splice(index, 1);
      saveToStorage('breedArr', JSON.stringify(breedArr));
      renderBreedTable(breedArr);
    }
  }
};
////////////////////////////////////
// Function: Initialization
const initBreed = function () {
  renderBreedTable(breedArr);
};
initBreed();


//==========================================
////////// EVENT HANDLERS //////////
//==========================================

////////////////////////////////////
// CLICK SUBMIT BUTTON
btnSubmitBreed.addEventListener('click', function (e) {
  // Get input data
  const data = {
    name: inputBreed.value,
    type: inputType.value,
  };
  // Render data
  if (validateBreed(data)) {
    breedArr.push(data);
    renderBreedTable(breedArr);
    clearBreedInput();
    // storage data
    saveToStorage('breedArr', JSON.stringify(breedArr));
  }
});

//////////////////////////////////////
// CLICK DELETE BUTTON
tableBodyBreed.addEventListener('click', deleteBreed);



//==========================================
// *** OPTION: ADDING BREED DATA STATER ****
//==========================================
const breed1 = {
  name: 'Husky',
  type: 'Dog',
};
const breed2 = {
  name: 'Doberman Pinscher',
  type: 'Dog',
};
const breed3 = {
  name: 'Tabby',
  type: 'Cat',
};
const breed4 = {
  name: 'Mixed Breed',
  type: 'Dog',
};
const breed5 = {
  name: 'Mixed Breed',
  type: 'Cat',
};
const breed6 = {
  name: 'Domestic Short Hair',
  type: 'Cat',
};

if (breedArr.length < 1) {
  console.log('empty breed');
  const breedArrStarter = [breed1, breed2, breed3, breed4, breed5, breed6];
  saveToStorage('breedArr', JSON.stringify(breedArrStarter));
  breedArrStarter.forEach(br => {
    breedArr.push(br);
  });
  renderBreedTable(breedArr);
}
