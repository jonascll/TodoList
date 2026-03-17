const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {

    
    on_click: (info) => ipcRenderer.invoke('on_click', info),
    on_start: () => ipcRenderer.invoke('on_start'),
    set_size: (size) => ipcRenderer.invoke('set_size', size)
})

