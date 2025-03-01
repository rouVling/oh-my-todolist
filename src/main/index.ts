import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import Store from 'electron-store'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import createFloatWindow from './floatwindow'

dayjs.extend(duration)

// console.log(dayjs.duration(1, "hour"))

const store = new Store()

// store.set("test", dayjs("2025-02-27T20:00:00").format("YYYY-MM-DD HH:mm:ss"))
// store.set("test", dayjs.duration(1, "hour").asMilliseconds())
// console.log(store.get("test"))

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 400,
    // height: 200,
    width: 1024,
    height: 540,
    show: false,
    autoHideMenuBar: true,
    // frame:false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    // alwaysOnTop: true,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + "/gantt.html")
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // mainWindow.loadFile(join(__dirname, '../renderer/gantt.html'))
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  // ipcMain.on('set-store', (_, key, value) => store.set(key, value))
  ipcMain.handle('get-store', (_, key) => store.get(key))
  ipcMain.handle('set-store', (_, key, value) => store.set(key, value))

  ipcMain.handle('create-float-window', async (event, args) => {
    createFloatWindow(args)
  })

  createWindow()
  // createFloatWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
