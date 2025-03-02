import React, { useState } from "react";
import { storageContext } from "../contexts";

import { TaskType } from "../../utils/types";
import { Button, IconButton, Input, Menu, MenuItem, Select, Typography } from "@mui/material";

import EditIcon from '@mui/icons-material/Edit';

import { produce } from "immer";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

interface Props {
  task: TaskType
}

export default function TableDuration({ task }: Props) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [durationNumber, setDurationNumber] = useState(0);
  const [durationUnit, setDurationUnit] = useState("minute");

  const { storageValue, setStorage } = React.useContext(storageContext);

  return <div>
    {/* {task.duration ? task.duration.humanize() : undefined} */}
    { task.duration ? (task.duration.asMinutes() % 30 === 0 ? task.duration.asMinutes() / 60 + " 小时" : task.duration.asMinutes() + " 分钟") : undefined }
    <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setOpen(true) }
    }>
      <EditIcon fontSize="small" sx={{ color: "gray" }} />
    </IconButton>
    <Menu anchorEl={anchorEl} open={open} onClose={() => { setOpen(false) }}
      // onScroll={(e) => {
      //   const scaler = durationUnit === "minute" ? 5 : 1;
      //   if (e.deltaY > 0) {
      //     setDurationNumber(durationNumber - scaler);
      //   }
      //   else {
      //     setDurationNumber(durationNumber + scaler);
      //   }
      // }}
    >
      <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
        <Input type="number" value={durationNumber} sx={{ width: "100px" }} onChange={(e) => { setDurationNumber(parseInt(e.target.value)) }}
        />

        <Select value={durationUnit} onChange={(e) => { setDurationUnit(e.target.value) }} variant="standard" MenuProps={{ anchorOrigin: { vertical: "top", horizontal: "left" }, transformOrigin: { vertical: "top", horizontal: "left" } }}>
          <MenuItem value="minute">分钟</MenuItem>
          <MenuItem value="hour">小时</MenuItem>
        </Select>
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
        <Button color="error" size="small" onClick={() => { setOpen(false); setStorage(produce((draft: any) => { let index = draft.content.tasks.findIndex((item: any) => item.id === task.id); draft.content.tasks[index].duration = undefined; })) }}>删除</Button>
        <Button size="small" onClick={() => { setOpen(false); setStorage(produce((draft: any) => { let index = draft.content.tasks.findIndex((item: any) => item.id === task.id); draft.content.tasks[index].duration = dayjs.duration(durationNumber, durationUnit as plugin.DurationUnitType); })) }}>保存</Button>
      </div>
    </Menu>
  </div >
}

