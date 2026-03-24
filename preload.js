const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('API', {

    
    get_saved_settings: () => ipcRenderer.invoke("get_saved_settings"),
    save_settings: (settings) => ipcRenderer.invoke("save_settings", settings),
    get_todos: () => ipcRenderer.invoke('get_todos'),
    set_size: (size) => ipcRenderer.invoke('set_size', size),
    get_screen_size:() => ipcRenderer.invoke('get_screen_size'),
    add_todo: (todo) => ipcRenderer.invoke('add_todo', todo),
    remove_todo: (todoId) => ipcRenderer.invoke('remove_todo', todoId),
    generate_uid: () => ipcRenderer.invoke('generate_uid'),
    get_window_pos: () => ipcRenderer.invoke("get_window_pos"),
    set_window_pos: (pos) => ipcRenderer.invoke("set_window_pos", pos),
    minimize: () => ipcRenderer.invoke("minimize")
})

