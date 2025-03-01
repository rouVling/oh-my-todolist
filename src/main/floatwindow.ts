import { shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

export default function createFloatWindow(tasks: any): void {
  // Create the browser window.
  const floatWindow = new BrowserWindow({
    width: 400,
    height: 200,
    show: true,
    autoHideMenuBar: true,
    frame:false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/float.js'),
      sandbox: false
    },
    alwaysOnTop: true,
  })

  floatWindow.on('ready-to-show', () => {
    floatWindow.show()
  })

  floatWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    floatWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + "/gantt.html")
    // floatWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    floatWindow.loadFile(join(__dirname, '../renderer/gantt.html'))
    // floatWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.handle('getTasks', async (event, args) => {
    return tasks
  })
}