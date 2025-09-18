import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import Store from 'electron-store'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import createFloatWindow from './floatwindow'
import { FastMCP, FastMCPEvents } from 'fastmcp'
import { z } from 'zod'; // Or any validation library that supports Standard Schema
import { deserialize } from 'v8'

async function initFastMCP() {
  const { FastMCP } = await import('fastmcp');
  const instance = new FastMCP({
    name: "oh-my-todolist MCP Server",
    version: "1.0.0",
  });
  // 在这里使用你的实例
  return instance;
}

dayjs.extend(duration)

// src/main/index.ts



let mcpServer: any = null;

// console.log(dayjs.duration(1, "hour"))

const store = new Store()
// const mcpServer = new MCPServer()

// store.set("test", dayjs("2025-02-27T20:00:00").format("YYYY-MM-DD HH:mm:ss"))
// store.set("test", dayjs.duration(1, "hour").asMilliseconds())
// console.log(store.get("test"))

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 400,
    // height: 200,
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    // frame:false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
    },
    // alwaysOnTop: true,
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // Set the main window for MCP server
    // mcpServer.setMainWindow(mainWindow)
    // Start MCP server
    // mcpServer.start()
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
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  mcpServer = await initFastMCP();

  (mcpServer as FastMCP).addTool({
    name: "get_todo_list",
    description: "获取待办事项列表",
    parameters: z.object({ }),

    execute: async () => {
      // @ts-ignore
      return JSON.stringify(store.get("content") || { tasks: [] } );
    }
  });

  (mcpServer as FastMCP).addTool({
    name: "get_todo_list_groups",
    description: "获取待办事项列表中的分组",
    parameters: z.object({ }),

    execute: async () => {
      // @ts-ignore
      return JSON.stringify(store.get("content")["content"]["groups"] || { tasks: [] } );
    }
  });

  (mcpServer as FastMCP).addTool({
    name: "modify_todo_list",
    description: "修改待办事项列表，支持增加和修改任务",
    parameters: z.object({
      tasks: z.array(z.object({

        id: z.number({
          description: "如果未提供，则表示新增，否则表示修改指定ID的任务",
        }).optional(),

        content: z.string({
          description: "任务内容，请在不丢失关键信息的前提下尽量简洁",
        }),

        status: z.enum([
          "on going",
          "done",
          "canceled",
          "postponed",
        ]),

        // alerts: z.array(z.string()).optional(),

        duration: z.string({
          description: "任务预计持续时间，格式如 PT5M，PT1H",
        }).optional(),

        start: z.string({
          description: "任务开始时间，格式如 2024-02-27T20:00:00",
        }).optional(),

        ddl: z.string({
          description: "任务截止时间，格式如 2024-02-27T20:00:00",
        }).optional(),

        group: z.string({
          description: "任务分组",
        }).optional(),

    }))
    }),

    execute: async (args) => {
      // 直接通过 IPC 向渲染进程发送任务数据，由渲染进程处理
      const windows = BrowserWindow.getAllWindows();
      windows.forEach(window => {
        window.webContents.send('mcp-modify-tasks', args.tasks);
      });

      return JSON.stringify({
        success: true,
        message: 'Tasks sent to renderer process for processing'
      });
    }
  });

  (mcpServer as FastMCP).start({
    transportType: 'httpStream',
    httpStream: {
      host: 'localhost',
      port: 6601
    }
  });


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

  // MCP related IPC handlers
  ipcMain.handle('mcp-get-tasks', async () => {
    // const content = store.get('content') as any;
    // return content?.tasks || [];
  })

  ipcMain.handle('mcp-add-tasks', async (_, tasks) => {
    // const content = store.get('content') as any;
    // if (content) {
    //   const currentTasks = content.tasks || [];
    //   const newTasks = tasks.map((task: any, index: number) => ({
    //     ...task,
    //     id: Math.max(...currentTasks.map((t: any) => t.id || 0), 0) + index + 1,
    //     alerts: []
    //   }));
      
    //   content.tasks = [...currentTasks, ...newTasks];
      
    //   // 添加新分组
    //   const newGroups = tasks.map((task: any) => task.group).filter((group: string) => group && !content.groups.includes(group));
    //   if (newGroups.length > 0) {
    //     content.groups = [...(content.groups || []), ...Array.from(new Set(newGroups))];
    //   }
      
    //   store.set('content', content);
      
    //   // 通知 renderer 进程更新
    //   const windows = BrowserWindow.getAllWindows();
    //   windows.forEach(window => {
    //     window.webContents.send('storage-updated', content);
    //   });
      
    //   return { success: true, addedTasks: newTasks.length };
    // }
    // return { success: false, error: 'No content found' };
  })

  ipcMain.handle('create-float-window', async (_, args) => {
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
  // mcpServer.stop()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
