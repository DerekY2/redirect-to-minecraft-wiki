let redirectEnabled = true

chrome.webNavigation.onBeforeNavigate.addListener((nav) => {
  if(redirectEnabled){
    chrome.tabs.query({ currentWindow: true, lastFocusedWindow: true }, (tab) => {
      let toWiki = new URL(nav.url).href.replace('minecraft.fandom.com', 'minecraft.wiki')
      chrome.tabs.update(tab.tabId, {url:toWiki})
    })
  }
}, {url: [{ hostContains: 'minecraft.fandom' }]});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get('popup-icon-src',(result)=>{
    const r=result['popup-icon-src']
    if(r){
      chrome.action.setIcon({path:chrome.runtime.getURL(r[1])})
    }
    else{
      chrome.action.setIcon({path:chrome.runtime.getURL('img/steve-icon128.png')})
    }
  })
  updateRedirectState();
});

chrome.runtime.onInstalled.addListener(() => {
  updateRedirectState();
});

chrome.storage.onChanged.addListener((changes, type) => {
  if (type === 'local' && changes['redirect-mc']) {
    redirectEnabled = changes['redirect-mc'].newValue ?? true; // Update the state
  }
});

function updateRedirectState() {
  chrome.storage.local.get('redirect-mc', (state) => {
    redirectEnabled = state['redirect-mc'] ?? true; // Default to true if undefined
  });
}