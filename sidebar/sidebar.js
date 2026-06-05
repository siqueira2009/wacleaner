function getCleaningOptions() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"].cleanOption');
    let cleaningOptions = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            cleaningOptions.push(checkbox.value);
        }
    });
    
    return cleaningOptions;
}

function selectAll() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"].cleanOption');
    const allCheckbox = document.getElementById('selectAll');

    if (allCheckbox.checked) {
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    } else {
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
}

const cleanLoaded = document.getElementById('cleanLoaded');
const cleanAll = document.getElementById('cleanAll');
const allCheckbox = document.getElementById('selectAll');

function cleanEventListeners() {
    cleanLoaded.addEventListener('click', () => {
        const options = getCleaningOptions();
    
        browser.runtime.sendMessage({action: "startCleaning", payload: options, type: "partial"});
    });

    cleanAll.addEventListener('click', () => {
        const options = getCleaningOptions();

        browser.runtime.sendMessage({action: "startCleaning", payload: options, type: "full"})
    });

    allCheckbox.addEventListener('change', selectAll);
}

document.addEventListener('DOMContentLoaded', () => {
    cleanEventListeners();
})