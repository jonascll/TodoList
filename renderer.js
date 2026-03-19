

var listOfTodos = []

const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
        const rect = entry.target.getBoundingClientRect()

        window.API.set_size({ "width": rect.width, "height": rect.height })
    }

})

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
    gearIcon.addEventListener('mousedown', () => HandleGearClicked())
    closeIcon.addEventListener('mouseenter', () => HandleMouseOverButton(true, closeIcon))
    closeIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, closeIcon))
    closeIcon.addEventListener('mousedown', () => { window.close() })
    maximizeIcon.addEventListener('mouseenter', () => HandleMouseOverButton(true, maximizeIcon))
    maximizeIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, maximizeIcon))
    minimizeIcon.addEventListener('mouseenter', () => HandleMouseOverButton(true, minimizeIcon))
    minimizeIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, minimizeIcon))
    observer.observe(page)
    var temp = await window.API.on_start()
    listOfTodos = temp.listOfTodos
    populateTodosOnStart(listOfTodos)
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
    //TODO:: write on click event in future
    checkIcon.addEventListener("mouseenter", () => HandleMouseOverButton(true, checkIcon))
    checkIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, checkIcon))
    checkIcon.addEventListener('mousedown', () => HandleRemoveTodo(checkIcon))
    const trashIcon = document.createElement("img")
    trashIcon.style.width = "20px"
    trashIcon.style.height = "20px"
    trashIcon.src = "./Resources/trash.svg"
    trashIcon.setAttribute("name", "trash")
    //TODO:: write on click event in future
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
    nameDiv.style.textAlign = "start"
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
    list.insertBefore(div, inputForm)
    var todo = new Todo(div.id, nameSpan.innerText, dueDateTimeSpan.innerText)
    window.API.add_todo(todo)
    listOfTodos.push(todo)
    ResetInputs()
}

function ResetInputs() {
    document.getElementById("taskName").value = ""
    document.getElementById("dueDateTime").value = null
}

function HandleGearClicked() {

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
    
    if(todos.length === 0) return;
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
        //TODO:: write on click event in future
        checkIcon.addEventListener("mouseenter", () => HandleMouseOverButton(true, checkIcon))
        checkIcon.addEventListener('mouseleave', () => HandleMouseOverButton(false, checkIcon))
        checkIcon.addEventListener('mousedown', () => HandleRemoveTodo(checkIcon))
        const trashIcon = document.createElement("img")
        trashIcon.style.width = "20px"
        trashIcon.style.height = "20px"
        trashIcon.src = "./Resources/trash.svg"
        trashIcon.setAttribute("name", "trash")
        //TODO:: write on click event in future
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
        nameDiv.style.textAlign = "start"
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
        
        list.insertBefore(div, inputForm)
    }



}

async function HandleRemoveTodo(element) {
    listOfTodos = await window.API.remove_todo(element.parentNode.parentNode.id)
   
    element.parentNode.parentNode.remove()
}


