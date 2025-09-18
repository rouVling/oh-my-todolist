import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      setStorage: (key: string, value: any) => void
      getStorage: (key: string) => Promise<any>
      createFloatWindow: (tasks: any) => void
      onStorageUpdated: (callback: (content: any) => void) => void
      onMCPModifyTasks: (callback: (tasks: any[]) => void) => void
      removeStorageUpdateListener: () => void
      removeMCPModifyTasksListener: () => void
    }
    electronAPI: {
      getTasks: () => any[]
      addTasks: (tasks: any[]) => void
    }
    mcpGetTasks?: () => any[]
    mcpAddTasks?: (tasks: any[]) => void
  }
}
