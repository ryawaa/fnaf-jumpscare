chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkFocus') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const focusedTabId = tabs[0].id;
        sendResponse({ isFocused: sender.tab.id === focusedTabId });
      });
      // Keep the message channel open until sendResponse is called
      return true;
    }
  });