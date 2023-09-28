'use strict';

const submitBtn = document.getElementById('submit-btn');
const healthyBtn = document.getElementById('healthy-btn');
const calcBMIBtn = document.getElementById('bmi-btn');
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

const petArr = JSON.parse(getFromStorage('petArr')) || [];
let healthyPetArr = [];
let healthyCheck = false;
const breedArr = JSON.parse(getFromStorage('breedArr')) || [];

//==========================================
//              FUNCTIONS
//==========================================

/////////////////////////////////////
// FUNCTION: Validate data
const validateData = function (dataObj) {
  let check = false;
  // Function: alert empty inputs
  const inputAlert = function (input) {
    alert(`Please input for ${input}`);
  };
  // Check if ID already exists
  const idAlreadyExist = petArr.some(petArrEl => petArrEl.id === dataObj.id);
  // I) Alert when any field is not filled in
  if (!dataObj.id) inputAlert('id');
  else if (!dataObj.name) inputAlert('name');
  else if (!dataObj.age) inputAlert('age');
  else if (!dataObj.weight) inputAlert('weight');
  else if (!dataObj.lengthPet) inputAlert('length');
  // II) Alert when any input is not valid
  // 1. alert if ID already exists
  else if (idAlreadyExist) {
    alert('ID must be unique!');
    // 2. check age input
  } else if (parseInt(dataObj.age) < 1 || parseInt(dataObj.age) > 15) {
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

/////////////////////////////////////
// FUNCTION :  Render table data
const renderTableData = function (arr) {
  tableBodyEl.innerHTML = '';
  for (let i = 0; i < arr.length; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `<th scope='row'>${arr[i].id}</th> 
  <td>${arr[i].name}</td>
  <td>${arr[i].age}</td>
  <td>${arr[i].type}</td>
  <td>${arr[i].weight} kg </td>
  <td>${arr[i].lengthPet} cm</td>
  <td>${arr[i].breed} </td>

  <td> <i class='bi bi-square-fill' style='color: ${arr[i].color}'> </i>
  </td>

  <td> <i class="${
    arr[i].vaccinated === true
      ? 'bi bi-check-circle-fill'
      : 'bi bi-x-circle-fill'
  }"> </i> </td>

  <td> <i class="${
    arr[i].dewormed === true ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'
  }"> </i> </td>

  <td> <i class="${
    arr[i].sterilized === true
      ? 'bi bi-check-circle-fill'
      : 'bi bi-x-circle-fill'
  }"> </i> </td>

  <td class='bmi-${arr[i].id}'>?</td>
 
  <td>${arr[i].date} </td>

  <td><button type="button" class="btn btn-danger btn-delete" data-id=${
    arr[i].id
  } >Delete</button> </td>`;

    tableBodyEl.appendChild(row);
  }
};

/////////////////////////////////////
// FUNCTION:  Delete pet
const deletePet = function (petId) {
  // comfirm before delete pet
  if (confirm('Are you sure?')) {
    // Find pet index in petArr array
    const index = petArr.findIndex(petArrEl => petArrEl.id === petId);
    petArr.splice(index, 1);
    renderTableData(petArr);
    // Save to local storage
    saveToStorage('petArr', JSON.stringify(petArr));
  }
};

/////////////////////////////////////
// FUNCTION:  Clear input
const clearInput = function () {
  idInput.value = '';
  nameInput.value = '';
  ageInput.value = '';
  typeInput.value = 'Select Type';
  weightInput.value = '';
  lengthInput.value = '';
  colorInput.value = '#000000';
  breedInput.value = 'Select 1';
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
};

/////////////////////////////////////
// FUNCTION: Show healthy pet
const showHealthyPet = function () {
  healthyCheck = !healthyCheck;
  if (healthyCheck) {
    //  check healthy
    healthyPetArr = petArr.filter(
      arrEl => arrEl.vaccinated && arrEl.dewormed && arrEl.sterilized
    );
    renderTableData(healthyPetArr);
    healthyBtn.textContent = 'Show All Pet';
  } else {
    renderTableData(petArr);
    healthyBtn.textContent = 'Show Healthy Pet';
  }
};

/////////////////////////////////////
// Function: Calculate BMI
const calcBMI = function (arr) {
  let bmi;
  if (arr.type === 'Dog') bmi = (arr.weight * 703) / arr.lengthPet ** 2;
  if (arr.type === 'Cat') bmi = (arr.weight * 886) / arr.lengthPet ** 2;
  return bmi.toFixed(2);
};

/////////////////////////////////////
// Function : Render breeds (corresponding to pet type)
const renderBreed = function () {
  // Get breed type
  const type = typeInput.value;
  if (type === 'Select Type') return;
  // Render breeds
  breedInput.innerHTML = '<option>Select Breed</option>';
  breedArr.forEach(breed => {
    const option = document.createElement('option');
    if (breed.type === type) {
      option.textContent = breed.name;
      breedInput.appendChild(option);
    }
  });
};

/////////////////////////////////////
// Function: Initialization
const init = function () {
  clearInput();
  renderTableData(petArr);
};
init();

//==========================================
//          EVENT HANDLERS
//==========================================

////////////////////////////////////
// CLICK 'TYPE' BUTTON
typeInput.addEventListener('click', renderBreed);

////////////////////////////////////
// CLICK 'SUBMIT' BUTTON
submitBtn.addEventListener('click', function (e) {
  // Check if showing only healthy pet  =>  switch to show all pets
  if (healthyCheck) {
    healthyCheckFunction();
  }
  // Get data
  const data = {
    id: idInput.value,
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
    date: new Date().toLocaleDateString('pt-PT'),
  };
  // Adding pet info to pet list
  const isValidate = validateData(data);
  if (isValidate) {
    petArr.push(data);
    clearInput();
    renderTableData(petArr);
    // Save data to local storage
    saveToStorage('petArr', JSON.stringify(petArr));
  }
});

////////////////////////////////////
//  CLICK 'SHOW HEALTHY PET' BUTTON
healthyBtn.addEventListener('click', showHealthyPet);

////////////////////////////////////
//  CLICK 'CALCULATE BMI' BUTTON
calcBMIBtn.addEventListener('click', function () {
  //  Find pets being displayed (all pets/ healthy pets)
  const petBeingDisplay = healthyCheck ? healthyPetArr : petArr;
  //  Calculate BMI
  petBeingDisplay.forEach(
    pet => (document.querySelector(`.bmi-${pet.id}`).textContent = calcBMI(pet))
  );
});

////////////////////////////////////
// CLICK DELETE BUTTON
tableBodyEl.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-delete')) {
    console.log('delete');
    deletePet(e.target.dataset.id);
  }
});

//*****************************************
// OPTION: ADDING PET DATA STATER
//*****************************************
const pet1 = {
  age: 2,
  breed: 'Husky',
  color: '#d1be3d',
  date: '21/06/2023',
  dewormed: true,
  id: 'P001',
  lengthPet: 50,
  name: 'Gau',
  sterilized: false,
  type: 'Dog',
  vaccinated: true,
  weight: 2,
};

if (petArr.length < 1) {
  const petArrStarter = [pet1];
  saveToStorage('petArr', JSON.stringify(petArrStarter));
  petArrStarter.forEach(pet => {
    petArr.push(pet);
  });
  renderTableData(petArr);
}
