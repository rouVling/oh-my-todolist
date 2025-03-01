import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  setStorage: (key: string, value: any) => {
    electronAPI.ipcRenderer.invoke('set-store', key, value)
  },
  getStorage: (key: string) => {
    return electronAPI.ipcRenderer.invoke('get-store', key)
  },
  createFloatWindow: (tasks: any) => {
    electronAPI.ipcRenderer.invoke('create-float-window', tasks)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
