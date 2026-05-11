browser.runtime.onMessage.addListener(async (msg) => {
  if (msg.action == "startCleaning") {
    const [tab] = await browser.tabs.query({
      url: "https://web.whatsapp.com/*"
    });

    if (!tab) return;

    if (msg.action == "startCleaning") {
      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content/cleaner.js"]
      });

      await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: (cleaningOptions, type) => {
          if (typeof main == 'function') {
            main(cleaningOptions, type);
          }
        },
        args: [msg.payload, msg.type]
      });
    }
  }
});