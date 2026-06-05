function getCleaningOptions() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    let cleaningOptions = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            cleaningOptions.push(checkbox.value);
        }
    });
    
    return cleaningOptions;
}

const cleanLoaded = document.getElementById('cleanLoaded');
const cleanAll = document.getElementById('cleanAll');

function cleanEventListeners() {
    cleanLoaded.addEventListener('click', () => {
        const options = getCleaningOptions();
    
        browser.runtime.sendMessage({action: "startCleaning", payload: options, type: "partial"});
    });

    cleanAll.addEventListener('click', () => {
        const options = getCleaningOptions();

        browser.runtime.sendMessage({action: "startCleaning", payload: options, type: "full"})
    })
}

document.addEventListener('DOMContentLoaded', () => {
    cleanEventListeners();
})