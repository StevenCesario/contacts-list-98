const inputForm = document.getElementById('input-form');
// console.log("inputForm:", inputForm)
const inputName = document.getElementById('input-name');
const inputPhone = document.getElementById('input-phone');

const contactULContainer = document.getElementById('contact-ul-container');

let contactList;
if (localStorage.getItem('contactList')) {
    contactList = JSON.parse(localStorage.getItem('contactList'));
    console.log("contactList: ", contactList);
    for (let [index, contactObject] of contactList.entries()) {
        console.log(`index: ${index}, contactObject: `, contactObject);
    }

    for (let contactItem of contactList) {
        console.log("current contactItem: ", contactItem);
        let liElement = document.createElement('li');
        let liElementName = document.createElement('input');
        let liElementPhone = document.createElement('input');
        let liElementEditButton = document.createElement('button');
        let liElementRemoveButton = document.createElement('button');

        liElementEditButton.addEventListener('click', (e) => {
            // e.target är knappen!! Inte the input forms!
            console.log("Ändra knapp pressed!")
            console.log("e.target: ", e.target);
            console.log("e.target.parentNode: ", e.target.parentNode);

            const inputNameField = e.target.parentNode.children[0];
            console.log("inputNameField: ", inputNameField);
            const inputPhoneField = e.target.parentNode.children[1];
            if (inputNameField.disabled == true) {
                inputNameField.disabled = false;
                inputPhoneField.disabled = false;
            }
            else {
                e.target.disabled = true;
            }
            if (e.target.textContent === "Ändra") {
                e.target.textContent = "Spara";
            }
            else {
                e.target.textContent = "Ändra";
            }
        })

        liElementRemoveButton.addEventListener('click', (e) => {
            console.log("Remove button clicked!")

            // *Ta bort från localStorage*

            // 1. Radera ska inte ta bort hela contactList utan endast uppdatera arrayen och ta bort det specifika objektet!
            for (let [index, contactObject] of contactList.entries()) {
                console.log(`index: ${index}, contactObject: `, contactObject);
                // Hitta objektet i contactList
                if (contactObject.id === contactItem.id) {
                    // Ta bort object från contactList Array på index
                    // "At position index, remove 1 item"
                    contactList.splice(index, 1);
                }
            }

            // 2. Skriv över localStorage med vår nya state!
            localStorage.setItem('contactList', JSON.stringify(contactList));

            // *Ta bort visuellt*
            e.target.parentNode.remove(); 
        })

        liElementName.placeholder = contactItem.contactName;
        liElementPhone.placeholder = contactItem.phone;
        liElementEditButton.textContent = "Ändra";
        liElementRemoveButton.textContent = "Radera";

        liElementName.disabled = true;
        liElementPhone.disabled = true;

        liElement.append(liElementName, liElementPhone, liElementEditButton, liElementRemoveButton);

        // console.log("liElement: ", liElement)

        contactULContainer.appendChild(liElement);
    }
}
else {
    contactList = [];
}



// console.log("contactList: ", contactList);

// console.log("crypto.randomUUID(): ", crypto.randomUUID());

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

    const contactID = crypto.randomUUID();
    let listItemObject = {
        id: contactID,
        contactName: inputName.value,
        phone: inputPhone.value,
    }

    liElementName.placeholder = inputName.value;
    liElementPhone.placeholder = inputPhone.value;
    liElementEditButton.textContent = "Ändra";
    liElementRemoveButton.textContent = "Radera";

    liElementName.disabled = true;
    liElementPhone.disabled = true;

    // liElementEditButton.addEventListener('click', (e) => {
    //     if (e.target.disabled == true) {
    //         e.target.disabled = false;
    //     }
    //     else {
    //         e.target.disabled = true;
    //     }
    //     if (e.target.textContent === "Ändra") {
    //         e.target.textContent = "Spara";
    //     }
    //     else {
    //         e.target.textContent = "Ändra";
    //     }
    // })

    liElementRemoveButton.addEventListener('click', (e) => {
        console.log("Remove button clicked!")

        // *Ta bort från localStorage*

        // 1. Radera ska inte ta bort hela contactList utan endast uppdatera arrayen och ta bort det specifika objektet!
        for (let [index, contactObject] of contactList.entries()) {
            console.log(`index: ${index}, contactObject: `, contactObject);
            // Hitta objektet i contactList
            if (contactObject.id === contactID) {
                // Ta bort object från contactList Array på index
                // "At position index, remove 1 item"
                contactList.splice(index, 1);
            }
        }

        // 2. Skriv över localStorage med vår nya state!
        localStorage.setItem('contactList', JSON.stringify(contactList));

        // *Ta bort visuellt*
        e.target.parentNode.remove(); 
    })

    liElement.append(liElementName, liElementPhone, liElementEditButton, liElementRemoveButton);

    contactULContainer.appendChild(liElement);

    contactList.push(listItemObject);
    localStorage.setItem('contactList', JSON.stringify(contactList));
});



/**
 * TODO:
 * Fix the EventListener on the "Ändra knapp"
 * localStorage implementation PARTIALLY DONE
 * input Validation!
 * Radera lista button
 * Get editing working
 * Make sure we can't add empty names or phone numbers
 * 
 */