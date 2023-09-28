'use strict';

const findBtn = document.getElementById('find-btn');
const idInput = document.getElementById('input-id');
const nameInput = document.getElementById('input-name');
const typeInput = document.getElementById('input-type');
const breedInput = document.getElementById('input-breed');
const vaccinatedInput = document.getElementById('input-vaccinated');
const dewormedInput = document.getElementById('input-dewormed');
const sterilizedInput = document.getElementById('input-sterilized');
const tableBody = document.getElementById('tbody');
const petArr = JSON.parse(getFromStorage('petArr')) ?? [];
const breedArr = JSON.parse(getFromStorage('breedArr')) ?? [];

//==========================================
///////////  FUNCTIONS  ///////////
//==========================================

////////////////////////////////////
// Function: Render pet breeds
const renderBreeds = function () {
  // Get all breeds from breedArr
  let breeds = [];
  breedArr.forEach(br => {
    breeds.push(br.name);
  });
  // Filter out the duplicated breeds
  breeds = breeds.filter((br, i, self) => {
    return self.indexOf(br) === i;
  });
  // Render breeds
  breedInput.innerHTML = '<option>Select Breed</option>';
  breeds.forEach(breed => {
    const option = document.createElement('option');
    option.innerHTML = breed;
    breedInput.appendChild(option);
  });
};

////////////////////////////////////
// Function: Render table data
const renderTableData = function (arr) {
  tableBody.innerHTML = '';
  arr.forEach(pet => {
    const row = document.createElement('tr');
    row.innerHTML = `<th scope='row' data-id="${pet.id}">${pet.id} </th> 
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
 `;
    tableBody.appendChild(row);
  });
};

////////////////////////////////////
// Function: Initialization
const init = function () {
  renderBreeds();
  renderTableData(petArr);
};
init();

//==========================================
////////// EVENT HANDLERS //////////
//==========================================

////////////////////////////////////
// CLICK FIND BUTTON
findBtn.addEventListener('click', function (e) {
  // Get data inputs
  const data = {
    id: idInput.value,
    name: nameInput.value,
    type: typeInput.value,
    breed: breedInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterilized: sterilizedInput.checked,
  };
  // Filter pets meet data inputs
  const petsFiltered = petArr.filter(pet => {
    // Check all conditions for each pet
    const idCon = data.id ? pet.id.includes(data.id) : true;
    const nameCon = data.name ? pet.name.includes(data.name) : true;
    const typeCon = data.type !== 'Select Type' ? data.type === pet.type : true;
    const breedCon =
      data.breed !== 'Select Breed' ? data.breed === pet.breed : true;
    const vaccinatedCon = data.vaccinated
      ? data.vaccinated === pet.vaccinated
      : true;
    const dewormedCon = data.dewormed ? data.dewormed === pet.dewormed : true;
    const sterilizedCon = data.sterilized
      ? data.sterilized === pet.sterilized
      : true;

    return (
      idCon &&
      nameCon &&
      typeCon &&
      breedCon &&
      vaccinatedCon &&
      dewormedCon &&
      sterilizedCon
    );
  });
  renderTableData(petsFiltered);
});
