const { app, BrowserWindow, ipcMain, screen} = require('electron/main')
var fs = require('fs');

const path = require('node:path')

const env = process.env.NODE_ENV || 'development';
const width = 800;
const height = 0;
var listOfTodos = []
var settings = {};
const dataPath = path.join(app.getPath("userData"), "data.json")
const settingsPath = path.join(app.getPath("userData"), "settings.json")

if (env === 'development') {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true,
      ignore: './Data'
    });
  } catch (_) { console.log('Error'); }
}

const createWindow = () => {
  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    frame: false,
    hasShadow: false,
    transparent: true,
    resizable: false
  })
  
  

  win.loadFile('index.html')
  return win;
 
}

app.whenReady().then(() => {



 
  HandleJsonCreation()
  ReadSettings(settingsPath)

  HandleArrayRead(dataPath)
  ipcMain.handle("get_saved_settings", () => { return settings })
  ipcMain.handle("save_settings", (_event, settings) => HandleSaveSettings(settings))
  ipcMain.handle("get_todos", () => { return { listOfTodos } })
  ipcMain.handle("add_todo", (_event, todo) => HandleAddTodoToJson(todo))
  ipcMain.handle("remove_todo", (_event, todoId) => HandleRemoveTodo(todoId))
  ipcMain.handle("generate_uid", () => { return GenerateUid() })
  ipcMain.handle("get_screen_size", () => {
    return screen.getPrimaryDisplay().workAreaSize
  })
  
  win = createWindow()


  win.on('system-context-menu', (event) => {
    event.preventDefault();
  });
  ipcMain.handle("get_window_pos", () => {
   return {x: win.getPosition()[0], y: win.getPosition()[1] }
  })
  ipcMain.handle("set_window_pos", (_event, pos) => {
    win.setResizable(true);
    win.setPosition(pos.x, pos.y, true)
    win.setResizable(false);
  })
  ipcMain.handle("set_size", (_event, size) => {
    win.setResizable(true);
    win.setSize(Math.round(size.width), Math.round(size.height));
    win.setResizable(false);
    return win.getSize()
  })
  ipcMain.handle("minimize", () => { win.minimize()})
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


function HandleSaveSettings(settings) {

  UpdateJson(JSON.stringify({ settings: settings }, null, 2), settingsPath)
}

function HandleAddTodoToJson(todo) {

  listOfTodos.push(todo)
  UpdateJson(JSON.stringify({ listOfTodos: listOfTodos }, null, 2), dataPath)


}

function ReadSettings(pathToJson) {
  try {
    const fileContent = fs.readFileSync(pathToJson, "utf-8")
    const data = JSON.parse(fileContent)
    settings = data.settings
  } catch (error) {
    console.error("Failed to load settings JSON file:", error.message);
  }
}

function HandleRemoveTodo(todoId) {
  listOfTodos.splice(listOfTodos.indexOf(listOfTodos.find(el => (el.id == todoId))), 1)
  UpdateJson(JSON.stringify({ listOfTodos: listOfTodos }, null, 2), dataPath)
  return listOfTodos

}

function UpdateJson(data, pathToJson) {

  fs.writeFile(pathToJson, data, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
    }
  });
}

async function HandleArrayRead(pathToJson) {
  try {
    const fileContent = fs.readFileSync(pathToJson, 'utf-8');


    const data = JSON.parse(fileContent);

    listOfTodos = data.listOfTodos;
  } catch (error) {
    console.error("Failed to load data JSON file:", error.message);
  }
}

function HandleJsonCreation() {
  try {
 
    fs.writeFileSync(path.join(app.getPath("userData"), "data.json"), JSON.stringify({ listOfTodos: [] }), { flag: 'wx' });
   

  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Error:', err.message);

    }
  }
  try {
     fs.writeFileSync(path.join(app.getPath("userData"), "settings.json"), JSON.stringify({
     settings: {
    width: 800,
    height: 250,
    dayBeforeColor: "rgba(70, 178, 31, 0.2)",
    sameDayColor: "rgba(229, 204, 36, 0.2)",
    lateColor: "rgba(157, 42, 42, 0.2)"
  }
    }, null, 2), { flag: 'wx' })
  } catch(err) {
    if (err.code !== 'EEXIST') {
      console.error('Error:', err.message);

    }
  }
}


function GenerateUid() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}


