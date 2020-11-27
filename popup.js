cheat.onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          { code: 'document.dispatchEvent(new CustomEvent("cheat"));' });
    });
};