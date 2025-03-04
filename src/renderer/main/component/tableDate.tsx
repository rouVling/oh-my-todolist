import React from "react";
import { TaskType } from "../../utils/types";

import { storageContext } from "../contexts";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { IconButton, Input, Menu } from "@mui/material";

import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { produce } from "immer";
import { Widgets } from "@mui/icons-material";


dayjs.extend(duration)
dayjs.extend(relativeTime)

interface Props {
  task: any,
  target: "ddl" | "start"
}

export default function TableDate({ task, target }: Props) {

  const { storageValue, setStorage } = React.useContext(storageContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(false);

  return <>
    {task[target] ? task[target].format("MM-DD HH:mm") : ""}
    <IconButton
      onClick={(e) => {
        // @ts-ignore
        setAnchorEl(e.currentTarget);
        setOpen(true)
      }}>
      <EditCalendarIcon fontSize="small" sx={{ color: "grey " }} />
    </IconButton >
    <Menu anchorEl={anchorEl} open={open} onClose={() => { setOpen(false) }}>
      <DateCalendar defaultValue={task[target] ?? dayjs()} onChange={
        (val) => {
          setStorage(
            produce((draft: any) => {
              let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
              draft.content.tasks[index][target] = val;
            })
          )
        }
      } />
      {/* <div style={{ width: "100%", display: "flex", flexDirection: "row", paddingLeft: "40px", marginRight: "20px"}}> */}
      <div>
        <div style={{ display: "flex", flexDirection: "row", paddingLeft: "40px", paddingRight: "40px", alignItems: "center", paddingBottom: "40px", justifyContent: "flex-end" }}>
          <Input sx={{ width: "60px", textAlign: "end", paddingLeft: "5px" }} type="number" placeholder="HH"
            value={task[target]?.hour()} onChange={(e) => {
              if (parseInt(e.target.value) > 24 || parseInt(e.target.value) < 0) {
                return
              }
              setStorage(
                produce((draft: any) => {
                  let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
                  draft.content.tasks[index][target] = task[target] ? task[target].hour(e.target.value) : dayjs().hour(parseInt(e.target.value));
                })
              )
            }
            } />
          :
          <Input sx={{ width: "60px", textAlign: "end", paddingLeft: "5px" }} type="number" placeholder="mm"
            value={task[target]?.minute()} onChange={(e) => {
              if (parseInt(e.target.value) > 60 || parseInt(e.target.value) < 0) {
                return
              }
              setStorage(
                produce((draft: any) => {
                  let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
                  draft.content.tasks[index][target] = task[target] ? task[target].minute(e.target.value) : dayjs().minute(parseInt(e.target.value));
                })
              )
            }}
          />
        </div>
      </div>
    </Menu>
  </>
}
