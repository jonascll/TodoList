const { app, BrowserWindow, ipcMain,Menu } = require('electron/main')
const path = require('node:path')

const width = 800;
const height = 600;


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

 
//   ipcMain.handle("on_click", async (_event, userInfo) => {
//     console.log(userInfo);
//     })
  ipcMain.handle("on_start", () => {return {'width' : width, 'height' : height}})
  win = createWindow()
  win.on('system-context-menu', (event) => {
  event.preventDefault();
});
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


