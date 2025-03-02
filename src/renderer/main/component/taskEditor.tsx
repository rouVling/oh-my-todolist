import React, { useEffect } from "react";

import { defaultTask, sortType, TaskType } from "../../utils/types";
import { storageContext } from "../contexts";

import dayjs, { locale } from "dayjs";
import "dayjs/locale/zh-cn";
import updateLocale from 'dayjs/plugin/updateLocale';
import duration from "dayjs/plugin/duration";

import { Button, Divider, FormControl, IconButton, Input, InputLabel, ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, MenuList, Paper, Select } from "@mui/material";


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DateInput from "./datePicker";
import { group } from "console";

dayjs.extend(duration);
dayjs.extend(updateLocale)
dayjs.updateLocale("zh-cn", { weekStart: 1, });

import { UNCATALOGUED } from "../../utils/constants";

interface TaskEditorProps {
  group: string | undefined,
  sort: sortType | undefined,
}

export default function TaskEditor(props: TaskEditorProps) {

  const [task, setTask] = React.useState<TaskType>(defaultTask);
  const { storageValue, setStorage } = React.useContext(storageContext);
  const [ defaultGroup, setDefaultGroup ] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    setDefaultGroup(props.group);
  }, [props.group])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <Paper elevation={1} sx={{ display: "flex", flexDirection: "column", marginBottom: "10px", paddingLeft: "20px", paddingRight: "20px", paddingBottom: "10px" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: "10px", marginTop: "15px" }}>
          <Input placeholder="添加任务" sx={{ width: "75%" }} value={task.content} onChange={
            (e) => {
              setTask({
                ...task,
                content: e.target.value,
              });
            }
          }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setStorage((sv) => {
                  return {
                    ...sv,
                    content: {
                      ...sv.content,
                      tasks: [...sv.content.tasks, {
                        ...task,
                        group: task.group ?? defaultGroup ?? undefined,
                        id: sv.content.tasks.length > 0 ? Math.max(...sv.content.tasks.map((item) => item.id)) + 1 : 0
                      }],
                    }
                  }
                })
                setTask(defaultTask);
              }
            }}
          />
          <FormControl sx={{ width: "15%" }}>
            {/* <InputLabel>分组</InputLabel> */}
            <Select variant="standard" value={task.group ?? defaultGroup ?? UNCATALOGUED} onChange={(e) => {
              setTask((tk) => {
                return {
                  ...tk,
                  group: e.target.value === UNCATALOGUED ? undefined : e.target.value,
                }
              })
              setDefaultGroup(undefined);
            }}>
              {
                storageValue.content.groups.map((item) => {
                  return <MenuItem key={item} value={item}>{item}</MenuItem>
                })
              }
              <MenuItem key={UNCATALOGUED} value={UNCATALOGUED}>{UNCATALOGUED}</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* <Divider /> */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <DateInput date={task.ddl} setDate={
            (val) => setTask((tk) => {
              return {
                ...tk,
                ddl: val,
              }
            }
            )} />
          <Button variant="outlined" size="small" disabled={(task?.content === undefined) || (task?.content === "")} onClick={() => {
            setStorage((sv) => {
              return {
                ...sv,
                content: {
                  ...sv.content,
                  tasks: [...sv.content.tasks, {
                    ...task,
                    group: task.group ?? defaultGroup ?? undefined,
                    id: sv.content.tasks.length > 0 ? Math.max(...sv.content.tasks.map((item) => item.id)) + 1 : 0
                  }],
                }
              }
            })
            setTask(defaultTask);
          }}>创建</Button>
        </div>
      </Paper>
    </LocalizationProvider>
  );
}
