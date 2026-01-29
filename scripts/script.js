const inputFormName = document.getElementById('input-name');
const inputFormTel = document.getElementById('input-phone');
const createContactButton = document.getElementById('create-contact-button');
const deleteListButton = document.getElementById('delete-list-button');
const contactULContainer = document.getElementById('contact-ul-container');

const errorMessageContainer = document.getElementById('error-message');
const errorMessageCreate = "Får ej skapa tom kontakt";
const errorMessageEdit = "Får ej spara tom kontakt";

// This part only cares about `contactData` and `localStorage`.
const DataStore = {
    getContacts() {
        return JSON.parse(localStorage.getItem('contactData')) || [];
    },

    saveContacts(inputList) {
        localStorage.setItem('contactData', JSON.stringify(inputList));
    },

    addContact(contactName, contactTel) {
        const contactList = this.getContacts();
        contactList.push({ id: crypto.randomUUID(), contactName: contactName, contactTel: contactTel });
        
        this.saveContacts(contactList);
        return contactList;
    },

    removeContact(id) {
        const contactList = this.getContacts();

        // This replaces the for loop + splice combo
        // Create a brand new array containing only the items that pass this specific condition
        // It's declarative and non-mutating!
        const updatedList = contactList.filter(c => c.id !== id);

        this.saveContacts(updatedList);
        return updatedList;
    },

    updateContact(id, newName, newTel) {
        const contactList = this.getContacts();

        // Use .map() to create a NEW list (once again; immutability and shallow copy to avoid side effects)
        const updatedContactList = contactList.map(c =>
            // Return a new object with updated values if the ID matches; otherwise, return the original contact
            c.id === id ? { ...c, contactName: newName, contactTel: newTel } : c
        );

        this.saveContacts(updatedContactList);
        return updatedContactList;
    }
};

// This part only cares about taking an array and drawing it.
const ViewRenderer = {
    render(contacts) {
        // Wipe the UI
        contactULContainer.innerHTML = ''; 

        // Map creates an array of strings; Join turns this array into one giant string
        const html = contacts.map(c => this.createHTML(c)).join(''); 

        // One single DOM "Paint" operation
        contactULContainer.insertAdjacentHTML('afterbegin', html);
    },

    createHTML(contact) {
        // We add data-id="${contact.id}" so the parent knows WHICH contact was clicked. 
        // It's our pointer back to the DataStore
        return `
            <li data-id="${contact.id}">
                <span>•</span>
                <input value="${contact.contactName}" disabled>
                <input value="${contact.contactTel}" disabled>
                <button class="edit-btn">Ändra</button>
                <button class="delete-btn">Radera</button>
            </li>
        `;
    }
};

// The Orchestrators! Our Event Listeners
// A. The "Add" Listener
createContactButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (!inputFormName.value || !inputFormTel.value) {
        errorMessageContainer.hidden = false;
        errorMessageContainer.textContent = errorMessageCreate;
        return
    }

    // Update DataStore with the new contact
    const newContactList = DataStore.addContact(inputFormName.value, inputFormTel.value);

    // Reflect changes in the ViewRenderer "Mirror"
    ViewRenderer.render(newContactList);

    // Reset input fields
    inputFormName.value = '';
    inputFormTel.value = '';
})

// B. The "Master" Event Delegation Listener
contactULContainer.addEventListener('click', (e) => {
    // We look at e.target to see *what* was clicked

    // Robust contextual identity: Find the parent <li> using .closest()
    const parentListItem = e.target.closest('li');
    if (!parentListItem) return;
    const id = parentListItem.dataset.id; // Get the ID via data-id

    // DETELE LOGIC
    if (e.target.classList.contains('delete-btn')) {
        // NEW: Confirm deletion!
        if (confirm("Är du säker på att du vill radera denna kontakt?")) {
            const newContactList = DataStore.removeContact(id); // Update DataStore *first*
            ViewRenderer.render(newContactList);                // Reflect changes in the ViewRenderer "Mirror"
        }
    }

    // EDIT/SAVE LOGIC
    if (e.target.classList.contains('edit-btn')) {
        const nameInput = parentListItem.querySelector('input:nth-child(2)'); // More robust than the previous e.target.parentNode.children[0]
        const telInput = parentListItem.querySelector('input:nth-child(3)');

        if (nameInput.disabled) {
            // ENTER EDIT MODE
            nameInput.disabled = false;
            telInput.disabled = false;
            e.target.textContent = "Spara";
            nameInput.focus(); // New neat feature: Set the cursor to be in the newly "unfrozen" text field!
        } else {
            // SAVE CHANGES: Scrape -> Store -> Render
            if (!nameInput.value || !telInput.value) {
                errorMessageContainer.hidden = false;
                errorMessageContainer.textContent = errorMessageEdit;
                return;
            }
            errorMessageContainer.hidden = true;

            // Re-render everything with the new updated contact
            const newContactList = DataStore.updateContact(id, nameInput.value, telInput.value);
            ViewRenderer.render(newContactList);
        }
    }
})

// C. The "Remove List" Listener
deleteListButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Check if the list is already empty to avoid unnecessary popups
    if (DataStore.getContacts().length === 0) {
        alert("Listan är redan tom.");
        return;
    }

    // NEW: Confirm deletion
    if (confirm("Är du säker på att du vill radera ALLA kontakter? Detta går inte att ångra.")) {
        // Update DataStore with an empty list
        DataStore.saveContacts([]);

        // Reflect changes in the ViewRenderer "Mirror"
        ViewRenderer.render([]);
    }
});

// Initiad Load
const initialContacts = DataStore.getContacts();
ViewRenderer.render(initialContacts);