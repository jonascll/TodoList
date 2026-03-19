const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {

    
   
    on_start: () => ipcRenderer.invoke('on_start'),
    set_size: (size) => ipcRenderer.invoke('set_size', size),
    add_todo: (todo) => ipcRenderer.invoke('add_todo', todo),
    remove_todo: (todoId) => ipcRenderer.invoke('remove_todo', todoId)
})

