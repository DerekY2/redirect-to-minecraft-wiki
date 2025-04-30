const popupLogo = document.getElementById("popup-logo-img1");
const exportMode = document.getElementById('export-mode')

popupLogo.addEventListener('click',()=>{
  changeLogo()
})

exportMode.addEventListener('change',()=>{
  setLocal('redirect-mc',exportMode.checked);
})

function setLocal(key, val){
  chrome.storage.local.get(key, (result)=> {
    if (chrome.runtime.lastError) {
        console.error("Error retrieving key:", key, chrome.runtime.lastError);
        return;
    }
    const original = result[key]; // Retrieve the current value
    if(Array.isArray(original)&&Array.isArray(val)){
      var  eq=arraysEqual(original,val)
    }else{
      var eq=original===val
    }
    if (!eq) { // Only update if the value is different
      //console.log("About to save - ", original, " ==> ", val);
      chrome.storage.local.set({ [key]: val }, function() {
        if (chrome.runtime.lastError) {
          console.error("Error saving value:", key, chrome.runtime.lastError);
        }
        else{
          //console.log("Value saved successfully for", key, ":", val);
        }
        try{
          refresh[key](key)
        }
        catch(error){
          // console.error(`REFRESH ERROR FOR KEY ${key}:\n${error}`)
        }
      });
    } else {
      //console.log("No change detected. Value not updated for key:", key);
    }
  });
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function changeLogo(){
  if(popupLogo.src==chrome.runtime.getURL('img/steve-icon.png')){
    popupLogo.src=chrome.runtime.getURL('img/the-nether.png')
    setLocal('popup-icon-src',['img/the-nether.png','img/the-nether128.png'])
    chrome.action.setIcon({path:'img/the-nether128.png'})
  }else if(popupLogo.src==chrome.runtime.getURL('img/the-nether.png')){
    popupLogo.src=chrome.runtime.getURL('img/chicken-jockey.png')
    setLocal('popup-icon-src',['img/chicken-jockey.png','img/chicken-jockey128.png'])
    chrome.action.setIcon({path:'img/chicken-jockey128.png'})
  }
  else if((popupLogo.src==chrome.runtime.getURL('img/chicken-jockey.png'))){
    popupLogo.src=chrome.runtime.getURL('img/steve-icon.png')
    setLocal('popup-icon-src',['img/steve-icon.png','img/steve-icon128.png'])
    chrome.action.setIcon({path:'img/steve-icon128.png'})
  }
}

function init(){
  chrome.storage.local.get(['popup-icon-src', 'redirect-mc'],(result)=>{
    const r=result['popup-icon-src']
    const state=result['redirect-mc']
    if(r){
      popupLogo.src=chrome.runtime.getURL(r[0])
      chrome.action.setIcon({path:r[1]})
    }
    else{
      popupLogo.src=chrome.runtime.getURL('img/steve-icon.png')
      chrome.action.setIcon({path:'img/steve-icon128.png'})
    }
    exportMode.checked=state==undefined?true:state
  })
}
init()