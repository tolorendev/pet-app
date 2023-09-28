'use strict';

const idInput = document.getElementById('input-id');
const nameInput = document.getElementById('input-name');
const ageInput = document.getElementById('input-age');
const typeInput = document.getElementById('input-type');
const weightInput = document.getElementById('input-weight');
const lengthInput = document.getElementById('input-length');
const colorInput = document.getElementById('input-color-1');
const breedInput = document.getElementById('input-breed');
const vaccinatedInput = document.getElementById('input-vaccinated');
const dewormedInput = document.getElementById('input-dewormed');
const sterilizedInput = document.getElementById('input-sterilized');
const tableBodyEl = document.getElementById('tbody');
const formContainer = document.getElementById('container-form');
const submitBtn = document.getElementById('submit-btn');
const petArr = JSON.parse(getFromStorage('petArr'));
const breedArr = JSON.parse(getFromStorage('breedArr')) || [];
let petId;
let checkIdTwoTimes;

//===========================================
//              FUNCTIONS
//===========================================

///////////////////////////////////
// Function: Render pets data
const renderTableData = function (arr) {
  tableBodyEl.innerHTML = '';
  arr.forEach(pet => {
    const row = document.createElement('tr');
    row.innerHTML = `<th scope='row' data-id="${pet.id}">${pet.id}</th> 
  <td>${pet.name}</td>
  <td>${pet.age} </td>
  <td>${pet.type} </td>
  <td>${pet.weight} kg </td>
  <td>${pet.lengthPet} cm</td>
  <td>${pet.breed} </td>
  <td> <i class='bi bi-square-fill' style='color: ${pet.color}'> </i>
  </td>
  <td> <i class="${
    pet.vaccinated === true ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'
  }"> </i> </td>
  <td> <i class="${
    pet.dewormed === true ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'
  }"> </i> </td>
  <td> <i class="${
    pet.sterilized === true ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'
  }"> </i> </td>
  <td>${pet.date} </td>
  <td><button type="button" class="btn btn-warning btn-edit" >Edit</button> </td>`;
    tableBodyEl.appendChild(row);
  });
};
renderTableData(petArr);

///////////////////////////////////
// Function: Render pet breeds
const renderBreed = function () {
  const typeInput = document.getElementById('input-type');
  const breedInput = document.getElementById('input-breed');
  const type = typeInput.value;
  breedInput.innerHTML = '<option>Select Breed</option>';
  breedArr.forEach(breed => {
    if (breed.type === type) {
      const breedOption = document.createElement('option');
      breedOption.innerHTML = breed.name;
      breedInput.appendChild(breedOption);
    }
  });
};
///////////////////////////////////
// FUNCTION: Validate data
const validateData = function (dataObj) {
  let check = false;
  // Function: alert empty inputs
  const inputAlert = function (input) {
    alert(`Please input for ${input}`);
  };
  // I) Alert when any field is not filled in
  if (!dataObj.name) inputAlert('name');
  else if (!dataObj.age) inputAlert('age');
  else if (!dataObj.weight) inputAlert('weight');
  else if (!dataObj.lengthPet) inputAlert('length');
  // II) Alert when any input is not valid
  // 2. check age input
  else if (parseInt(dataObj.age) < 1 || parseInt(dataObj.age) > 15) {
    alert('Age must between 1 and 15!');
    // 3. Check weight input
  } else if (parseInt(dataObj.weight) < 1 || parseInt(dataObj.weight) > 15) {
    alert('Weight must between 1 and 15!');
    // 4. Check length input
  } else if (
    parseInt(dataObj.lengthPet) < 1 ||
    parseInt(dataObj.lengthPet) > 100
  ) {
    alert('Length must between 1 and 100!');
    // 5. Check type input
  } else if (dataObj.type === 'Select Type') {
    alert('Please select Type!');
    // 6. Check breed input
  } else if (dataObj.breed === 'Select Breed') {
    alert('Please select Breed!');
    // 7. check = true, if all inputs are valid
  } else {
    check = true;
  }
  return check;
};

////////////////////////////////
// Function: Start edit pets (Show current pet data)
const startEditPet = function (id) {
  const pet = petArr.find(pet => pet.id === id);
  idInput.value = pet.id;
  nameInput.value = pet.name;
  ageInput.value = pet.age;
  typeInput.value = pet.type;
  weightInput.value = pet.weight;
  lengthInput.value = pet.lengthPet;
  colorInput.value = pet.color;
  // Render breed coressponding to pet type
  renderBreed();
  breedInput.value = pet.breed;
  vaccinatedInput.checked = pet.vaccinated;
  dewormedInput.checked = pet.dewormed;
  sterilizedInput.checked = pet.sterilized;
};

//===========================================
//              EVENT HANDLERS
//===========================================

///////////////////////////////////
// Click Edit button
tableBodyEl.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-edit')) {
    const curRow = e.target.closest('tr');
    // Find pet ID being edited
    petId = e.target.closest('tr').querySelector('th').dataset.id;
    // RESET if click 1 Edit button 2 times
    if (checkIdTwoTimes === petId) {
      // Hide form
      formContainer.classList.add('hide');
      // Remove border mark for row
      curRow.classList.remove('border-3', 'border-warning');
      checkIdTwoTimes = null;
      return;
    } else {
      checkIdTwoTimes = petId;
    }
    // Remove all row mark
    tableBodyEl
      .querySelectorAll('tr')
      .forEach(rowEl => rowEl.classList.remove('border-3', 'border-warning'));
    // Show form
    formContainer.classList.remove('hide');
    // Mark current row being edited
    curRow.classList.add('border-3', 'border-warning');
    // show current pet data
    startEditPet(petId);
  }
});

///////////////////////////////////
// Click Submit button
submitBtn.addEventListener('click', function (e) {
  // Find current index of pet in petArr
  const index = petArr.findIndex(pet => pet.id === petId);
  // Get data
  const data = {
    id: petArr[index].id, // keep origin ID
    name: nameInput.value,
    age: parseInt(ageInput.value),
    type: typeInput.value,
    weight: parseInt(weightInput.value),
    lengthPet: parseInt(lengthInput.value),
    color: colorInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
    date: petArr[index].date, // keep origin Date
  };
  // Check data
  const isValidate = validateData(data);
  // Update data
  if (isValidate) {
    // Update new pet data
    petArr.splice(index, 1, data);
    // Save pet data to local storage
    saveToStorage('petArr', JSON.stringify(petArr));
    // Render pet table data
    renderTableData(petArr);
    // Hide edit form
    formContainer.classList.add('hide');
    // REmove border mark for current row
    const curRow = document
      .querySelector(`th[data-id='${petId}']`)
      .closest('tr');
    curRow.classList.remove('border-3', 'border-warning');
    // Reset checking 'click edit button 2 times'
    checkIdTwoTimes = null;
  }
});
