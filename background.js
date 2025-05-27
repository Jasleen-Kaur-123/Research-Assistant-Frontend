//The Extesion R will not opening from side panel we have to tell chrome that 
// whatever user clicks on the extensions toolbar icon or action btn
// the extension side panel should open automatically
chrome.sidePanel.setPanelBehavior({
        openPanelOnActionClick:true
})