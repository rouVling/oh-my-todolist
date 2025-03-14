import React from "react";
import { storageContext } from "../contexts";
import { ButtonGroup, useTheme } from "@mui/material";

import { TaskType } from "../../utils/types";
import { IconButton } from "@mui/material";
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';

import { produce } from "immer";

interface Props {
  task: TaskType
}

export default function TableState({ task }: Props) {

  const theme = useTheme();

  const { storageValue, setStorage } = React.useContext(storageContext);

  return <div style={{ display: "flex", flexDirection: "row" }}>
    <IconButton onClick={() => {
      setStorage(produce((draft: any) => {
        let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
        draft.content.tasks[index].status = "on going";
      }))
    }}>
      {task.status === "on going" ?
        // @ts-ignore
        <HourglassFullIcon sx={{ color: theme.taskStatus.going }} fontSize="small"/> :
        <HourglassEmptyIcon fontSize="small"/>
      }
    </IconButton>
    <IconButton onClick={() => {
      setStorage(produce((draft: any) => {
        let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
        draft.content.tasks[index].status = "done";
      }))
    }}>
      {task.status === "done" ?
        // @ts-ignore
        <CheckCircleIcon sx={{ color: theme.taskStatus.done }} fontSize="small"/> :
        <CheckCircleOutlineIcon fontSize="small"/>
      }
    </IconButton>
    <IconButton onClick={() => {
      setStorage(produce((draft: any) => {
        let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
        draft.content.tasks[index].status = "postponed";
      }))
    }}>
      {task.status === "postponed" ?
        // @ts-ignore
        <WatchLaterIcon sx={{ color: theme.taskStatus.postponed }} fontSize="small"/> :
        <WatchLaterOutlinedIcon fontSize="small"/>
      }
    </IconButton>
    <IconButton onClick={() => {
      setStorage(produce((draft: any) => {
        let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
        draft.content.tasks[index].status = "canceled";
      }))
    }}>
      {task.status === "canceled" ?
        // @ts-ignore
        <EventBusyIcon sx={{ color: theme.taskStatus.canceled }} fontSize="small"/> :
        <EventBusyOutlinedIcon fontSize="small"/>
      }
    </IconButton>
  </div>
}
