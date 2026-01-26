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

    liElement = document.createElement('li');
    liElement.innerHTML = `${inputName.value} - ${inputPhone.value}`;
    contactULContainer.appendChild(liElement);
});