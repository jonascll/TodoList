const { app, BrowserWindow, ipcMain, Menu } = require('electron/main')
var fs = require('fs');

const path = require('node:path')
const env = process.env.NODE_ENV || 'development';
const width = 800;
const height = 0;
var listOfTodos = []
const jsonPath = path.join(__dirname, 'Data', 'data.json');
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



  var dir = './Data';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  HandleJsonCreation(jsonPath)
  HandleArrayRead(jsonPath)
  ipcMain.handle("on_start", () => { return { listOfTodos } })
  ipcMain.handle("add_todo", (_event, todo) => HandleAddTodoToJson(todo))
  ipcMain.handle("remove_todo", (_event, todoId) => HandleRemoveTodo(todoId))
  ipcMain.handle("generate_uid", () => {return GenerateUid()})
    win = createWindow()

    
    win.on('system-context-menu', (event) => {
      event.preventDefault();
    });
    ipcMain.handle("set_size", (_event, size) => { win.setSize(Math.round(size.width), Math.round(size.height)) })
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


function HandleAddTodoToJson(todo)
{
  
  listOfTodos.push(todo)
  UpdateJson(JSON.stringify({listOfTodos: listOfTodos},null, 2))


}


function HandleRemoveTodo(todoId) {
  listOfTodos.splice( listOfTodos.indexOf(listOfTodos.find(el => (el.id == todoId))), 1)
  UpdateJson(JSON.stringify({listOfTodos: listOfTodos},null, 2))
  return listOfTodos
  
}

function UpdateJson(data) {

  fs.writeFile(jsonPath, data, (err) => {
        if (err) {
            console.error("Error writing to file:", err);
        } 
    });
}

async function HandleArrayRead(pathToJson) {
  try {
        // Construct an absolute path to avoid "file not found" issues
       
        
        // Read the file as a string
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        
        // Parse the string into a JS object
        const data = JSON.parse(fileContent);
        
        listOfTodos = data.listOfTodos;
    } catch (error) {
        console.error("Failed to load local JSON file:", error.message);
    }
}

function HandleJsonCreation(pathToJson) {
 try {

    fs.writeFileSync(pathToJson, JSON.stringify( {listOfTodos : []} ), { flag: 'wx' });
    console.log('Success: New file created.');
   } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Error:', err.message);

    }
  }
}


 function GenerateUid(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
 }