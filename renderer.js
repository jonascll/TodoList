
var openedSettings = false
var listOfTodos = []
var maximized = false;
var maximizeSize = {}
var windowPos = {}
var settings = {}
/*const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
       
        const rect = entry.borderBoxSize[0]
        dimensions.height = rect.blockSize
        dimensions.width = rect.inlineSize
      
       
        const widthInput = document.getElementById("settingsWidth")
        const heightInput = document.getElementById("settingsHeight")
        if(widthInput && heightInput) {
            widthInput.value = dimensions.width
            heightInput.value = dimensions.height
        }
    }

})*/

function Debug(stringToDebug) {
    const debugText = document.getElementById("debugText");
    debugText.style.display = 'block'
    debugText.innerText = stringToDebug
}


window.onload = async () => {


    const page = document.getElementById('page')
    const closeIcon = document.getElementById("closeIcon")
    const maximizeIcon = document.getElementById("maximizeIcon")
    const minimizeIcon = document.getElementById("minimizeIcon")
    const gearIcon = document.getElementById("gearIcon")
    const addButton = document.getElementById("addButton")
    addButton.addEventListener("mouseenter", () => HandleMouseOverButton(true, addButton))
    addButton.addEventListener("mouseleave", () => HandleMouseOverButton(false, addButton))
    addButton.addEventListener("mousedown", () => HandleAddTodo())
    gearIcon.addEventListener('mouseenter', () => HandleMouseOverButton(true, gearIcon))
    gearIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, gearIcon))
    gearIcon.addEventListener('mousedown', (event) => HandleGearClicked(event))
    closeIcon.addEventListener('mouseenter', () => HandleMouseOverButton(true, closeIcon))
    closeIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, closeIcon))
    closeIcon.addEventListener('mousedown', () => { window.close() })
    maximizeIcon.addEventListener('mouseenter', () => HandleMouseOverButton(true, maximizeIcon))
    maximizeIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, maximizeIcon))
    minimizeIcon.addEventListener('mouseenter', () => HandleMouseOverButton(true, minimizeIcon))
    minimizeIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, minimizeIcon))
    //observer.observe(page)
    maximizeIcon.addEventListener('mousedown', () => HandleMaximize())
    minimizeIcon.addEventListener('mousedown', () => HandleMinimize())
    maximizeSize = await window.API.get_screen_size()
    settings = await window.API.get_saved_settings()
   
    var todos = await window.API.get_todos()
    listOfTodos = todos.listOfTodos
    window.API.set_size({width: settings.width, height: settings.height})
    populateTodosOnStart(listOfTodos)
    CheckDueTimes(listOfTodos)
    setInterval(() => {CheckDueTimes(listOfTodos)},60000 )
}

async function HandleMinimize() {
    window.API.minimize()
}

async function HandleMaximize() {
    maximized = !maximized
    if(maximized) {
        windowPos = await window.API.get_window_pos()
       
        window.API.set_window_pos({x: 0, y:0})
        
        window.API.set_size({width: maximizeSize.width, height: maximizeSize.height})
        
    } else {
         
        window.API.set_size({width: settings.width, height: settings.height})
        window.API.set_window_pos({x: windowPos.x, y: windowPos.y})
    
    }

}

async function HandleAddTodo() {
    if (document.getElementById("taskName").value == "" || document.getElementById("dueDateTime").value == "") {
        return
    }
    const dateToFormat = new Date(document.getElementById("dueDateTime").value)
    const nameSpan = document.createElement("span")

    nameSpan.innerText = document.getElementById("taskName").value

    const dueDateTimeSpan = document.createElement("span")
    dueDateTimeSpan.innerText = dateToFormat.toLocaleString()

    const iconDivs = document.createElement("div")
    iconDivs.style.display = "flex"
    iconDivs.style.flexDirection = "row"
    iconDivs.style.justifyContent = "space-evenly"
    iconDivs.style.alignItems = "center"
    const checkIcon = document.createElement("img")
    checkIcon.style.width = "20px"
    checkIcon.style.height = "20px"
    checkIcon.src = "./Resources/done.svg"
    checkIcon.setAttribute("name", "done")
    checkIcon.addEventListener("mouseenter", () => HandleMouseOverButton(true, checkIcon))
    checkIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, checkIcon))
    checkIcon.addEventListener('mousedown', () => HandleRemoveTodo(checkIcon))
    const trashIcon = document.createElement("img")
    trashIcon.style.width = "20px"
    trashIcon.style.height = "20px"
    trashIcon.src = "./Resources/trash.svg"
    trashIcon.setAttribute("name", "trash")
    trashIcon.addEventListener("mouseenter", () => HandleMouseOverButton(true, trashIcon))
    trashIcon.addEventListener("mouseleave", () => HandleMouseOverButton(false, trashIcon))
    trashIcon.addEventListener("mousedown", () => HandleRemoveTodo(trashIcon))
    iconDivs.appendChild(trashIcon)
    iconDivs.appendChild(checkIcon)

    const div = document.createElement("div")
    div.style.display = "flex"
    div.style.flexDirection = "row"
    div.style.justifyContent = "space-around"
    div.style.alignItems = "center"
    div.style.padding = "1%"
    const nameDiv = document.createElement('div')
    nameDiv.style.display = "flex"
    nameDiv.style.flexDirection = "row"
    nameDiv.style.justifyContent = "center"
    nameDiv.style.flex = 1
    nameDiv.style.minWidth = 0
    nameDiv.style.textAlign = "center"
    nameDiv.style.width = "100%"
    nameDiv.style.alignItems = "center"
    nameSpan.style.flex = "0 1 auto"
    nameSpan.style.minWidth = 0;
    nameSpan.style.overflowWrap = "break-word"
    nameDiv.appendChild(nameSpan)
    const dateDiv = document.createElement('div')
    dateDiv.style.display = "flex"
    dateDiv.style.flexDirection = "row"
    dateDiv.style.justifyContent = "center"
    dateDiv.style.alignItems = "center"
    dateDiv.style.flex = 1
    dateDiv.style.minWidth = 0
    dateDiv.style.textAlign = "center"
    dueDateTimeSpan.style.minWidth = 0;
    dueDateTimeSpan.style.flex = "0 1 auto"
    dueDateTimeSpan.style.overflowWrap = "break-word"
    dateDiv.appendChild(dueDateTimeSpan)
    iconDivs.style.flex = "1 1 0px"
    div.appendChild(nameDiv)
    div.appendChild(dateDiv)
    div.appendChild(iconDivs)
    const list = document.getElementById("listOfTodo")
    const inputForm = document.getElementById("inputForm")
    div.id = await window.API.generate_uid()
    list.appendChild(div)
    var todo = new Todo(div.id, nameSpan.innerText, dueDateTimeSpan.innerText)
    window.API.add_todo(todo)
    listOfTodos.push(todo)
    ResetInputs()
    CheckDueTimes(listOfTodos)
}

function ResetInputs() {
    document.getElementById("taskName").value = ""
    document.getElementById("dueDateTime").value = null
}

function HandleGearClicked(event) {
    const settingsWidget = document.getElementById("settingsMenu")
    if (settingsWidget === null) {
        CreateSettingsWidget(event.clientX, event.clientY)
    } else {
        settingsWidget.remove()
    }

}

function HandleMouseOverAdd(hovered, element) {
    if (hovered) {
        element.src = "./Resources/add-active.svg"
    } else {
        element.src = "./Resources/add.svg"
    }
}

function HandleMouseOverClose(hovered, element) {
    if (hovered) {
        element.src = "./Resources/titlebutton-close-active.svg"
    } else {
        element.src = "./Resources/titlebutton-close.svg"
    }

}

function HandleMouseOverMaximize(hovered, element) {
    if (hovered) {
        element.src = "./Resources/titlebutton-maximize-active.svg"
    } else {
        element.src = "./Resources/titlebutton-maximize.svg"
    }
}

function HandleMouseOverMinimize(hovered, element) {
    if (hovered) {
        element.src = "./Resources/titlebutton-minimize-active.svg"
    } else {
        element.src = "./Resources/titlebutton-minimize.svg"
    }
}

function HandleMouseOverGear(hovered, element) {

    if (hovered) {
        element.src = "./Resources/gear-wide-active.svg"
    } else {
        element.src = "./Resources/gear-wide.svg"
    }
}


function HandleMouseOverButton(hovered, element) {
    if (hovered) {
        element.src = `./Resources/${element.name}-active.svg`
    } else {
        element.src = `./Resources/${element.name}.svg`
    }
}



window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
}, false);


function populateTodosOnStart(todos) {

    if (todos.length === 0) return;
    for (const todo of todos) {

        const nameSpan = document.createElement("span")

        nameSpan.innerText = todo.taskName
        const dueDateTimeSpan = document.createElement("span")
        dueDateTimeSpan.innerText = todo.dueDateTime

        const iconDivs = document.createElement("div")
        iconDivs.style.display = "flex"
        iconDivs.style.flexDirection = "row"
        iconDivs.style.justifyContent = "space-evenly"
        iconDivs.style.alignItems = "center"
        const checkIcon = document.createElement("img")
        checkIcon.style.width = "20px"
        checkIcon.style.height = "20px"
        checkIcon.src = "./Resources/done.svg"
        checkIcon.setAttribute("name", "done")
       
        checkIcon.addEventListener("mouseenter", () => HandleMouseOverButton(true, checkIcon))
        checkIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, checkIcon))
        checkIcon.addEventListener('mousedown', () => HandleRemoveTodo(checkIcon))
        const trashIcon = document.createElement("img")
        trashIcon.style.width = "20px"
        trashIcon.style.height = "20px"
        trashIcon.src = "./Resources/trash.svg"
        trashIcon.setAttribute("name", "trash")
  
        trashIcon.addEventListener("mouseenter", () => HandleMouseOverButton(true, trashIcon))
        trashIcon.addEventListener("mouseleave", () => HandleMouseOverButton(false, trashIcon))
        trashIcon.addEventListener("mousedown", () => HandleRemoveTodo(trashIcon))
        iconDivs.appendChild(trashIcon)
        iconDivs.appendChild(checkIcon)

        const div = document.createElement("div")
        div.style.display = "flex"
        div.style.flexDirection = "row"
        div.style.justifyContent = "space-around"
        div.style.alignItems = "center"
        div.style.padding = "1%"
        const nameDiv = document.createElement('div')
        nameDiv.style.display = "flex"
        nameDiv.style.flexDirection = "row"
        nameDiv.style.justifyContent = "center"
        nameDiv.style.flex = 1
        nameDiv.style.minWidth = 0
        nameDiv.style.textAlign = "center"
        nameDiv.style.width = "100%"
        nameDiv.style.alignItems = "center"
        nameSpan.style.flex = "0 1 auto"
        nameSpan.style.minWidth = 0;
        nameSpan.style.overflowWrap = "break-word"
        nameDiv.appendChild(nameSpan)
        const dateDiv = document.createElement('div')
        dateDiv.style.display = "flex"
        dateDiv.style.flexDirection = "row"
        dateDiv.style.justifyContent = "center"
        dateDiv.style.alignItems = "center"
        dateDiv.style.flex = 1
        dateDiv.style.minWidth = 0
        dateDiv.style.textAlign = "center"
        dueDateTimeSpan.style.minWidth = 0;
        dueDateTimeSpan.style.flex = "0 1 auto"
        dueDateTimeSpan.style.overflowWrap = "break-word"
        dateDiv.appendChild(dueDateTimeSpan)
        iconDivs.style.flex = "1 1 0px"
        div.appendChild(nameDiv)
        div.appendChild(dateDiv)
        div.appendChild(iconDivs)
        const list = document.getElementById("listOfTodo")
        const inputForm = document.getElementById("inputForm")
        div.id = todo.id

        list.appendChild(div)
        
    }



}

async function HandleRemoveTodo(element) {
    listOfTodos = await window.API.remove_todo(element.parentNode.parentNode.id)

    element.parentNode.parentNode.remove()
}


function CreateSettingsWidget(posX, posY) {
    const settingsWidget = document.createElement("div")
    settingsWidget.style.position = "absolute"
    settingsWidget.style.left = posX + "px"
    settingsWidget.style.top = (posY + 20) + "px"
    settingsWidget.style.width = "200px"
    settingsWidget.style.height = "180px"
    settingsWidget.style.backgroundColor = "rgba(50, 50, 50, 1)"
    settingsWidget.style.borderRadius = "10px"
    settingsWidget.style.zIndex = "1000";
    settingsWidget.style.display = "flex"
    settingsWidget.style.flexDirection = "column"
    settingsWidget.id = "settingsMenu"
    settingsWidget.style.gap = "10px"
    settingsWidget.justifyContent = "center"
    const heightDiv = document.createElement("div")
    const widthDiv = document.createElement("div")
    const dayBeforeColorDiv = document.createElement("div")
    const sameDayColorDiv = document.createElement("div")
    const lateColorDiv = document.createElement("div")
    heightDiv.style.display = "flex"
    heightDiv.style.flexDirection = "row"
    heightDiv.style.justifyContent = "space-evenly"
    widthDiv.style.display = "flex"
    widthDiv.style.flexDirection = "row"
    widthDiv.style.justifyContent = "space-evenly"
    widthDiv.style.marginTop = "10px"
    dayBeforeColorDiv.style.display = "flex"
    dayBeforeColorDiv.style.flexDirection = "row"
    dayBeforeColorDiv.style.justifyContent = "space-evenly"
    sameDayColorDiv.style.display = "flex"
    sameDayColorDiv.style.flexDirection = "row"
    sameDayColorDiv.style.justifyContent = "space-evenly"
    lateColorDiv.style.display = "flex"
    lateColorDiv.style.flexDirection = "row"
    lateColorDiv.style.justifyContent = "space-evenly"
    const lateColorLabel = document.createElement("label")
    lateColorLabel.innerText = "Color too late: "
    const dayBeforeLabel = document.createElement("label")
    dayBeforeLabel.innerText = "Color day before: "
    const sameDayLabel = document.createElement("label")
    sameDayLabel.innerText = "Color same day: "
    const widthLabel = document.createElement("label")
    widthLabel.innerText = "Width: "
    const widthInput = document.createElement("input")
    widthInput.type = "number"
    widthInput.addEventListener('keydown', preventNonDigits)
    widthInput.placeholder = "Width"
    widthInput.id = "settingsWidth"
    widthInput.value = settings.width
    widthInput.className = "formItem"
    widthInput.style.width = "100px"
    widthInput.addEventListener("change",() => 
        {
            DimensionsChanged({ width: widthInput.value, height: settings.height })
            settings.width = widthInput.value
            window.API.save_settings(settings)
    
        })
    const heightLabel = document.createElement("label")
    heightLabel.innerText = "Height: "
    const heightInput = document.createElement("input")
    heightInput.type = "number"
    heightInput.addEventListener('keydown', preventNonDigits)
    heightInput.placeholder = "Height"
    heightInput.value = settings.height
    heightInput.id = "settingsHeight"
    heightInput.className = "formItem"
    heightInput.style.width = "100px"
    heightInput.addEventListener("change", () => 
        {
            DimensionsChanged({ width: settings.width, height: heightInput.value })
            settings.height = heightInput.value
            window.API.save_settings(settings)
        })
    const dayBeforeColorInput = document.createElement("input")
    dayBeforeColorInput.type = "color"
    dayBeforeColorInput.value = settings.dayBeforeColor
    dayBeforeColorInput.style.backgroundColor = "rgba(50, 50, 50, 1)"
    dayBeforeColorInput.style.border = 0
    dayBeforeColorInput.addEventListener("change", () => 
        {
            settings.dayBeforeColor = hexToRGB(dayBeforeColorInput.value, 0.2)
            window.API.save_settings(settings)
            CheckDueTimes(listOfTodos)
        })
    const sameDayColorInput = document.createElement("input")
    sameDayColorInput.type = "color"
    sameDayColorInput.value = settings.sameDayColor
    sameDayColorInput.style.backgroundColor = "rgba(50, 50, 50, 1)"
    sameDayColorInput.style.border = 0
    sameDayColorInput.addEventListener("change", () => 
        {
            settings.sameDayColor = hexToRGB(sameDayColorInput.value, 0.2)
            window.API.save_settings(settings)
            CheckDueTimes(listOfTodos)
        })
    const lateColorInput = document.createElement("input")
    lateColorInput.type = "color"
    lateColorInput.value = settings.lateColor
    lateColorInput.style.backgroundColor = "rgba(50, 50, 50, 1)"
    lateColorInput.style.border = 0
    lateColorInput.addEventListener("change", () => 
        {
            settings.lateColor = hexToRGB(lateColorInput.value, 0.2)
            window.API.save_settings(settings)
            CheckDueTimes(listOfTodos)
        })
    lateColorDiv.appendChild(lateColorLabel)
    lateColorDiv.appendChild(lateColorInput)
    dayBeforeColorDiv.appendChild(dayBeforeLabel)
    dayBeforeColorDiv.appendChild(dayBeforeColorInput)
    sameDayColorDiv.appendChild(sameDayLabel)
    sameDayColorDiv.appendChild(sameDayColorInput)
    widthDiv.appendChild(widthLabel)
    widthDiv.appendChild(widthInput)
    heightDiv.appendChild(heightLabel)
    heightDiv.appendChild(heightInput)
    settingsWidget.appendChild(widthDiv)
    settingsWidget.appendChild(heightDiv)
    settingsWidget.appendChild(dayBeforeColorDiv)
    settingsWidget.appendChild(sameDayColorDiv)
    settingsWidget.appendChild(lateColorDiv)
    settingsWidget.addEventListener("mouseleave", () => {
        settingsWidget.remove();

    });



    document.body.appendChild(settingsWidget);

}


async function DimensionsChanged(newDimensions) {


    const newSize = await window.API.set_size({
        width: parseInt(newDimensions.width),
        height: parseInt(newDimensions.height)
    });

    settings.height = newSize[1]
    settings.width = newSize[0]
    const widthInput = document.getElementById("settingsWidth")
    const heightInput = document.getElementById("settingsHeight")
    if (widthInput && heightInput) {
        widthInput.value = settings.width
        heightInput.value = settings.height
    }

}


function CheckDueTimes(todos) {
        todos.forEach(todo => {
           const dueDate = new Date(todo.dueDateTime)
           const currentDate = new Date()
            if(((currentDate - dueDate)/1000) < -86400 && ((currentDate - dueDate)/1000)  > -172800) {
                const todoDiv = document.getElementById(todo.id)
            
                todoDiv.style.backgroundColor = settings.dayBeforeColor
            }
            if(((currentDate - dueDate)/1000) > -86400 && ((currentDate - dueDate)/1000) < 0) {
                const todoDiv = document.getElementById(todo.id)
            
                todoDiv.style.backgroundColor = settings.sameDayColor
            }
           if(((currentDate - dueDate)/1000) >= 0) {
            const todoDiv = document.getElementById(todo.id)
            
                todoDiv.style.backgroundColor = settings.lateColor
           }
            
        });
}


function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}


const preventNonDigits = (event) => {
  
  const controlKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
  
  
  const navigationKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];

  if (
    controlKeys.includes(event.key) ||
    navigationKeys.includes(event.key) ||
    
    (event.ctrlKey === true || event.metaKey === true)
  ) {
    return;
  }


  if (event.key === ' ' || isNaN(Number(event.key))) {
    event.preventDefault();
  }
};