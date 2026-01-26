const inputForm = document.getElementById('input-form');
console.log("inputForm:", inputForm)
const inputName = document.getElementById('input-name');
const inputPhone = document.getElementById('input-phone');

const contactULContainer = document.getElementById('contact-ul-container');

inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted!')
    console.log(`inputName: ${inputName.value}`);
    console.log(`inputPhone: ${inputPhone.value}`);

    let liElement = document.createElement('li');
    let liElementName = document.createElement('input');
    let liElementPhone = document.createElement('input');
    let liElementEditButton = document.createElement('button');
    let liElementRemoveButton = document.createElement('button');

    liElementName.placeholder = inputName.value;
    liElementPhone.placeholder = inputPhone.value;
    liElementEditButton.textContent = "Ändra";
    liElementRemoveButton.textContent = "Radera";

    liElementName.disabled = true;
    liElementPhone.disabled = true;

    liElement.append(liElementName, liElementPhone, liElementEditButton, liElementRemoveButton);

    contactULContainer.appendChild(liElement);
});