


const observer = new ResizeObserver(entries => {
    for(let entry of entries) {
        const rect = entry.target.getBoundingClientRect()

        window.API.set_size({"width" :rect.width, "height": rect.height})
    }
    
})

function Debug(stringToDebug) {
    const debugText = document.getElementById("debugText");
    debugText.style.display = 'block'
    debugText.innerText = stringToDebug
}


window.onload = () => {
    //const dimensions = await window.API.on_start() 
    const page = document.getElementById('page')
    // page.style.width = dimensions.width + 'px'
    // page.style.height = dimensions.height + 'px'
    const closeIcon = document.getElementById("closeIcon")
    const maximizeIcon = document.getElementById("maximizeIcon")
    const minimizeIcon = document.getElementById("minimizeIcon")
    const gearIcon = document.getElementById("gearIcon")
    const addButton = document.getElementById("addButton")
    addButton.addEventListener("mouseenter", () => HandleMouseOverAdd(true, addButton))
    addButton.addEventListener("mouseleave", () => HandleMouseOverAdd(false, addButton))
    addButton.addEventListener("mousedown", () => HandleAddTodo())
    gearIcon.addEventListener('mouseenter', () => HandleMouseOverGear(true, gearIcon))
    gearIcon.addEventListener('mouseleave', () => HandleMouseOverGear(false, gearIcon))
    gearIcon.addEventListener('mousedown', () => HandleGearClicked())
    closeIcon.addEventListener('mouseenter', () => HandleMouseOverClose(true, closeIcon))
    closeIcon.addEventListener('mouseleave', () => HandleMouseOverClose(false, closeIcon))
    closeIcon.addEventListener('mousedown', () => {window.close()})
    maximizeIcon.addEventListener('mouseenter', () => HandleMouseOverMaximize(true, maximizeIcon))
    maximizeIcon.addEventListener('mouseleave', () => HandleMouseOverMaximize(false, maximizeIcon))
    minimizeIcon.addEventListener('mouseenter', () => HandleMouseOverMinimize(true, minimizeIcon))
    minimizeIcon.addEventListener('mouseleave', () => HandleMouseOverMinimize(false, minimizeIcon))
    observer.observe(page)
   
}



function HandleAddTodo() {
   const div = document.createElement("div")
   div.style.display = "flex"
   div.style.direction = "row"
   div.style.justifyContent = "space-around"
   const nameSpan = document.createElement("span")
   nameSpan.innerText = document.getElementById("taskName").value
   const dueDateTimeSpan = document.createElement("span")
   dueDateTimeSpan.innerText = document.getElementById("dueDateTime").value
   div.appendChild(nameSpan)
   div.appendChild(dueDateTimeSpan)
   
   
   const list = document.getElementById("listOfTodo")
   const inputForm = document.getElementById("inputForm")
   list.insertBefore(div, inputForm)
   ResetInputs()
}

function ResetInputs() {
    document.getElementById("taskName").value = ""
    document.getElementById("dueDateTime").value = null
    
}

function HandleGearClicked() {
    
}

function HandleMouseOverAdd(hovered, element) {
    if(hovered) {
        element.src = "./Resources/add-active.svg"
    } else {
        element.src = "./Resources/add.svg"
    }
}

function HandleMouseOverClose(hovered, element) {
    if(hovered) {
        element.src = "./Resources/titlebutton-close-active.svg"
    } else {
        element.src = "./Resources/titlebutton-close.svg"
    }
}

function HandleMouseOverMaximize(hovered, element) {
    if(hovered) {
        element.src = "./Resources/titlebutton-maximize-active.svg"
    } else {
        element.src = "./Resources/titlebutton-maximize.svg"
    }
} 

function HandleMouseOverMinimize(hovered, element) {
    if(hovered) {
        element.src = "./Resources/titlebutton-minimize-active.svg"
    } else {
        element.src = "./Resources/titlebutton-minimize.svg"
    }
}

function HandleMouseOverGear(hovered, element) {

if(hovered) {
        element.src = "./Resources/gear-wide-active.svg"
    } else {
        element.src = "./Resources/gear-wide.svg"
    }
}




window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
}, false);



