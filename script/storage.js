'use strict';
const sideNavbar = document.getElementById('sidenavbar');
const sideNavbarList = document.querySelector(' #sidenavbar ul');
//===========================================
///////////  FUNCTIONS  ///////////
//===========================================


// Function:  Save data
function saveToStorage(key, value) {
  localStorage.setItem(key, value);
}

// Function: Get data
function getFromStorage(key) {
  return localStorage.getItem(key);
}

//===========================================
////////// EVENT HANDLERS //////////
//===========================================


// Click side bar (make animation)
sideNavbar.addEventListener('click', e => {
  if (e.target.closest('ul') !== sideNavbarList) {
    sideNavbar.classList.toggle('active');
  }
});
