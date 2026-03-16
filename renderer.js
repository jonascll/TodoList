

function Debug(stringToDebug) {
    const debugText = document.getElementById("debugText");
    debugText.style.display = 'block'
    debugText.innerText = stringToDebug
}


window.onload = async () => {
    const dimensions = await window.API.on_start() 
    const page = document.getElementById('page')
    page.style.width = dimensions.width
    page.style.height = dimensions.height
}



window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
}, false);



