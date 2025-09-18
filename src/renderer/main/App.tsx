import React, { useEffect, useRef, useState } from "react";
import SettingDrawer from "./component/drawer";
import Wrapper from "./component/wrapper";
import Tasks from "./tasks";

import { Theme, ThemeProvider } from '@mui/material';
import { darkTheme, primaryTheme } from '../utils/themes';

import { setThemeContext } from "./contexts";
import { storageContext } from "./contexts";
import { defaultStorage, sortType, StorageSchema, TaskType } from "../utils/types";
import { set } from "mermaid/dist/diagrams/state/id-cache.js";
import TaskEditor from "./component/taskEditor";
import { taskTypeDump, taskTypePartialDump, taskTypePartialLoad } from "../utils/converts";
import { UNCATALOGUED } from "../utils/constants";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import dayjs, { locale } from "dayjs";
import "dayjs/locale/zh-cn";
import updateLocale from 'dayjs/plugin/updateLocale';
import duration from "dayjs/plugin/duration";

import { produce } from "immer";

dayjs.extend(duration);
dayjs.extend(updateLocale)
dayjs.updateLocale("zh-cn", { weekStart: 1, });

const drawerWidth = 180;

export default function MainApp() {

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>(darkTheme);
  const [group, setGroup] = React.useState<string | undefined>(undefined);
  const [sort, setSort] = React.useState<sortType | undefined>(undefined);
  const [storageValue, setStorage] = useState<StorageSchema | undefined>(undefined);

  // 使用 useRef 保存最新的 storageValue 和 setStorage 引用
  const storageRef = useRef<StorageSchema | undefined>(storageValue);
  const setStorageRef = useRef(setStorage);

  // 更新 ref 引用
  useEffect(() => {
    storageRef.current = storageValue;
    setStorageRef.current = setStorage;
  }, [storageValue, setStorage]);


  const handleClickGroup = (group_index: number) => {
    setGroup((storageValue?.content.groups[group_index]) ?? UNCATALOGUED);
    setSort(undefined);
  }
  const handleClickTab = (tab: number) => {
    setGroup(undefined);
    switch (tab) {
      case 0:
        setSort("today");
        break;
      case 1:
        setSort("recent");
        break;
      case 2:
        setSort("all");
        break;
      case 3:
        setSort("incomplete");
        break;
    }
  }

  useEffect(() => {
    console.log("loaded")
    //@ts-ignore
    window.api.getStorage("content").then((res) => {
      console.log("loadedRaw")
      console.log(res)
      if (res) {
        setStorage({
          ...res,
          content: {
            ...res.content,
            tasks: res.content.tasks.map(taskTypePartialLoad)
          }
        });
      }
      else {
        setStorage(defaultStorage);
      }
      if (res.settings === undefined) {
        // @ts-ignore
        setStorage(produce((draft: StorageSchema) => {
          draft.content.settings = defaultStorage.content.settings;
        }
        ));
      }
    })
  }, [])

  useEffect(() => {
    // 监听来自 main 进程的存储更新
    //@ts-ignore
    const handleStorageUpdate = (event, updatedContent) => {
      console.log('Received storage update from main process:', updatedContent);
      
      // 确保数据结构完整
      const completeContent = {
        ...updatedContent,
        mermaidConfig: {
          mermaidInit: {
            gantt: {}
          },
          ...updatedContent.mermaidConfig
        },
        settings: {
          theme: "dark",
          recentDay: 2,
          showNotCompleteBefore: false,
          ...updatedContent.settings
        }
      };
      
      setStorage(prev => ({
        ...prev,
        content: {
          ...completeContent,
          tasks: completeContent.tasks.map(taskTypePartialLoad)
        }
      }));
    };

    //@ts-ignore
    window.electron.ipcRenderer.on('storage-updated', handleStorageUpdate);

    return () => {
      //@ts-ignore
      window.electron.ipcRenderer.removeListener('storage-updated', handleStorageUpdate);
    };
  }, [])

  // 独立的 MCP 事件监听器，避免因 storageValue 变化而重复注册
  useEffect(() => {
    // 监听来自 MCP 的任务修改事件
    //@ts-ignore
    const handleMCPModifyTasks = (event, tasks) => {
      console.log('Received MCP modify tasks:', tasks);
      
      console.log(event)
      console.log(tasks)

      const currentStorage = storageRef.current;
      if (!currentStorage) {
        console.warn("Storage not loaded yet. Ignoring MCP modify tasks.");
        return;
      }
      console.log("Current storage:", currentStorage);

      // 使用 ref 中的 setStorage 函数来更新存储
      setStorageRef.current(produce(currentStorage, (draft: StorageSchema) => {
        const currentTasks = draft.content.tasks || [];
        const currentGroups = draft.content.groups || [];
        
        tasks.forEach((task: any) => {
          if (task.id) {
            // 修改现有任务
            const existingTaskIndex = currentTasks.findIndex(t => t.id === task.id);
            if (existingTaskIndex !== -1) {
              currentTasks[existingTaskIndex] = {
                ...currentTasks[existingTaskIndex],
                content: task.content,
                status: task.status,
                duration: task.duration ? dayjs.duration(task.duration) : undefined,
                start: task.start ? dayjs(task.start) : undefined,
                ddl: task.ddl ? dayjs(task.ddl) : undefined,
                group: task.group,
              };
            }
          } else {
            // 新增任务
            const newId = Math.max(...currentTasks.map(t => t.id || 0), 0) + 1;
            const newTask: TaskType = {
              id: newId,
              content: task.content,
              status: task.status,
              duration: task.duration ? dayjs.duration(task.duration) : undefined,
              start: task.start ? dayjs(task.start) : undefined,
              ddl: task.ddl ? dayjs(task.ddl) : undefined,
              group: task.group,
              alerts: []
            };
            currentTasks.push(newTask);

            // 如果有新的分组，添加到分组列表
            if (task.group && !currentGroups.includes(task.group)) {
              currentGroups.push(task.group);
            }
          }
        });
        
        draft.content.tasks = currentTasks;
        draft.content.groups = currentGroups;
      }));
    };

    //@ts-ignore
    window.electron.ipcRenderer.on('mcp-modify-tasks', handleMCPModifyTasks);

    return () => {
      //@ts-ignore
      window.electron.ipcRenderer.removeListener('mcp-modify-tasks', handleMCPModifyTasks);
    };
  }, [])

  useEffect(() => {
    // console.log("storageValue changed")
    // console.log(storageValue)
    if (storageValue) {
      // let dumped = storageValue
      //@ts-ignore
      // dumped.content.tasks = dumped.content.tasks.map(taskTypePartialDump)
      //@ts-ignore
      window.api.setStorage("content", {
        ...storageValue,
        content: {
          ...storageValue.content,
          tasks: storageValue.content.tasks.map(taskTypePartialDump)
        }
      });
    }
  }, [storageValue])

  return <storageContext.Provider value={{ storageValue: (storageValue ?? defaultStorage), setStorage }}>
    <setThemeContext.Provider value={setTheme}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
          <Wrapper
            // groups={groups}
            // setGroups={setGroups}
            clickGroup={handleClickGroup}
            clickTab={handleClickTab}
            toggleSettingDrawerOpen={() => setDrawerOpen((open) => !open)}
          >
            <TaskEditor group={group} sort={sort} />
            <Tasks group={group} sort={sort} />
            <SettingDrawer open={drawerOpen} onClose={() => { setDrawerOpen((open) => !open) }} />
          </Wrapper>
        </LocalizationProvider>
      </ThemeProvider>
    </setThemeContext.Provider>
  </storageContext.Provider>
} 