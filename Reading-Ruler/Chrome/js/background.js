// Conditionally initialize the options.
if (!localStorage.isInitialized) {
    
    localStorage.useCTRL = true;
    localStorage.useALT = false;
    localStorage.useSHIFT = false;
    localStorage.useKEY = 'y';
    
    localStorage.isInitialized = true;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStorageValue")
      sendResponse({data: localStorage});
});