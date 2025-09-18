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
  },
  // 监听存储更新事件
  onStorageUpdated: (callback: (content: any) => void) => {
    electronAPI.ipcRenderer.on('storage-updated', (_, content) => {
      callback(content)
    })
  },
  // 监听MCP任务修改事件
  onMCPModifyTasks: (callback: (tasks: any[]) => void) => {
    electronAPI.ipcRenderer.on('mcp-modify-tasks', (_, tasks) => {
      callback(tasks)
    })
  },
  // 移除存储更新监听器
  removeStorageUpdateListener: () => {
    electronAPI.ipcRenderer.removeAllListeners('storage-updated')
  },
  // 移除MCP任务修改监听器
  removeMCPModifyTasksListener: () => {
    electronAPI.ipcRenderer.removeAllListeners('mcp-modify-tasks')
  }
}

// MCP related APIs
const electronMCPAPI = {
  getTasks: () => {
    return window.mcpGetTasks ? window.mcpGetTasks() : []
  },
  addTasks: (tasks: any[]) => {
    if (window.mcpAddTasks) {
      window.mcpAddTasks(tasks)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('electronAPI', electronMCPAPI)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.electronAPI = electronMCPAPI
}
