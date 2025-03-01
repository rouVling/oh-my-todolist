import React, { useEffect, useState } from "react";
import SettingDrawer from "./component/drawer";
import Wrapper from "./component/wrapper";
import Tasks from "./tasks";

import { Theme, ThemeProvider } from '@mui/material';
import { darkTheme, primaryTheme } from '../utils/themes';

import { setThemeContext } from "./contexts";
import { storageContext } from "./contexts";
import { defaultStorage, sortType, StorageSchema } from "../utils/types";
import { set } from "mermaid/dist/diagrams/state/id-cache.js";
import TaskEditor from "./component/taskEditor";
import { taskTypeDump, taskTypePartialDump, taskTypePartialLoad } from "../utils/converts";

const drawerWidth = 180;

export default function MainApp() {

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [theme, setTheme] = React.useState<Theme>(darkTheme);
  const [group, setGroup] = React.useState<string | undefined>(undefined);
  const [sort, setSort] = React.useState<sortType | undefined>(undefined);
  const [storageValue, setStorage] = useState<StorageSchema | undefined>(undefined);


  const handleClickGroup = (group_index: number) => {
    // setGroup([group_index]);
    setSort(undefined);
  }
  const handleClickTab = (tab: number) => {
    setGroup(undefined);
    switch (tab) {
      case 0:
        setSort("today");
        break;
      case 1:
        setSort("all");
        break;
      case 2:
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
          ...res.content,
          content: {
            ...res.content,
            tasks: res.content.tasks.map(taskTypePartialLoad)
          }
        });
      }
      else {
        setStorage(defaultStorage);
      }
    })
  }, [])

  useEffect(() => {
    console.log("storageValue changed")
    console.log(storageValue)
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
      <ThemeProvider theme={darkTheme}>
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
      </ThemeProvider>
    </setThemeContext.Provider>
  </storageContext.Provider>
}
