const inputForm = document.getElementById('input-form'); // TODO: Är denna verkligen nödvändig längre?
const inputName = document.getElementById('input-name');
const inputPhone = document.getElementById('input-phone');
const createContactButton = document.getElementById('create-contact-button');
const deleteListButton = document.getElementById('delete-list-button');
const contactULContainer = document.getElementById('contact-ul-container');
const errorMessageContainer = document.getElementById('error-message');

const errorMessageCreate = "Får ej skapa tom kontakt";
const errorMessageEdit = "Får ej spara tom kontakt";

let contactList;
if (localStorage.getItem('contactList')) {
    contactList = JSON.parse(localStorage.getItem('contactList'));

    for (let contactItem of contactList) {
        let liElement = document.createElement('li');
        // TODO: Går det att snygga upp dessa fyra rader i och med att vi upprepar oss med createElement?
        let liElementName = document.createElement('input');
        let liElementPhone = document.createElement('input');
        let liElementEditButton = document.createElement('button');
        let liElementRemoveButton = document.createElement('button');

        liElementEditButton.addEventListener('click', (e) => {
            const newContactNameField = e.target.parentNode.children[0];
            const newContactPhoneField = e.target.parentNode.children[1];

            if (newContactNameField.disabled == true) {
                newContactNameField.disabled = false;
                newContactPhoneField.disabled = false;
            }
            else {
                if (newContactNameField.value.length === 0 || newContactPhoneField.value.length === 0) {
                    errorMessageContainer.hidden = false;
                    errorMessageContainer.textContent = errorMessageEdit;
                    return
                }

                errorMessageContainer.hidden = true;

                newContactNameField.disabled = true;
                newContactPhoneField.disabled = true;
                updateContactListEntry(contactItem.id, "name", newContactNameField.value);
                updateContactListEntry(contactItem.id, "phone", newContactPhoneField.value);
                localStorage.setItem('contactList', JSON.stringify(contactList));
            }

            e.target.textContent === "Ändra"
                ? e.target.textContent = "Spara"
                : e.target.textContent = "Ändra";
        })

        liElementRemoveButton.addEventListener('click', (e) => {
            for (let [index, contactObject] of contactList.entries()) {
                if (contactObject.id === contactItem.id) {
                    contactList.splice(index, 1);
                }
            }

            localStorage.setItem('contactList', JSON.stringify(contactList));

            e.target.parentNode.remove(); 
        })

        liElementName.placeholder = contactItem.contactName;
        liElementPhone.placeholder = contactItem.phone;
        liElementEditButton.textContent = "Ändra";
        liElementRemoveButton.textContent = "Radera";

        liElementName.disabled = true;
        liElementPhone.disabled = true;

        liElement.append(liElementName, liElementPhone, liElementEditButton, liElementRemoveButton);
        contactULContainer.appendChild(liElement);
    }
}
else {
    contactList = [];
}

function updateContactListEntry(contactId, nameOrPhone, newValue) {
    for (let contactObject of contactList) {
        if (contactObject.id === contactId) {
            nameOrPhone === "name"
                ? contactObject.contactName = newValue
                : contactObject.phone = newValue;
        }
    }
}

createContactButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (inputName.value.length === 0 || inputPhone.value.length === 0) {
        errorMessageContainer.hidden = false;
        errorMessageContainer.textContent = errorMessageCreate;
        return
    }

    // Om koden når hit har vi en valid entry. Sätt errorMessageContainer.hidden tillbaka till true
    errorMessageContainer.hidden = true;
    
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
            for (let [index, contactObject] of contactList.entries()) {
                if (contactObject.id === contactID) {
                    contactList.splice(index, 1);
                }
            }

        localStorage.setItem('contactList', JSON.stringify(contactList));

        e.target.parentNode.remove(); 
    })
    
    liElement.append(liElementName, liElementPhone, liElementEditButton, liElementRemoveButton);
    
    contactULContainer.appendChild(liElement);

    contactList.push(listItemObject);
    localStorage.setItem('contactList', JSON.stringify(contactList));

    inputName.value = "";
    inputPhone.value = "";
});

deleteListButton.addEventListener('click', (e) => {
    e.preventDefault();
    contactList.length = 0;
    localStorage.setItem('contactList', JSON.stringify(contactList));
    location.reload();
})


/**
 * TODO:
 * Fix the EventListener on the "Ändra knapp" DONE
 * localStorage implementation DONE
 * input Validation! DONE
 * Radera lista button DONE
 * Get editing working DONE
 * Make sure we can't add empty names or phone numbers DONE
 * Make edit button interact med localStorage DONE
 * updateContactListEntry med en bool för att ge möjlighet att remove entry eller separat funktion för att ta bort entry?
 * Gör om alla if/else till ternary operator för att öva och bli comfortable
 * Synka ALLT som är utanför Skapa eventListener pch utanför med funktioner when possible
 * Implementera så att forms töms efter varje kontakt man lägger till DONE
 * Kör en location.reload() varje gång vi skapar en ny kontakt?
 */