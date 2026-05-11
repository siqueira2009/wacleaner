const clean = document.getElementById('cleanWhatsApp');

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
clean.addEventListener('click', () => {
    const options = getCleaningOptions();

    browser.runtime.sendMessage({action: "startCleaning", payload: options});
});