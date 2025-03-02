import React from "react";

import { storageContext } from "../contexts";
import { TaskType } from "../../utils/types";
import { UNCATALOGUED } from "../../utils/constants";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Menu, MenuItem, Select } from "@mui/material";

import { produce } from "immer";

interface Props {
  task: TaskType
}

export default function TableGroup({ task }: Props) {

  const { storageValue, setStorage } = React.useContext(storageContext);

  const [openSelect, setOpenSelect] = React.useState(false);

  return <Select
    disableUnderline
    IconComponent={ExpandMoreIcon}
    variant="standard"
    value={task.group}
    onChange={(e) => {
      setStorage(produce((draft: any) => {
        let index = draft.content.tasks.findIndex((item: any) => item.id === task.id);
        draft.content.tasks[index].group = e.target.value;
      }))
    }}
  >
    {storageValue?.content.groups.map((group: string) => {
      return <MenuItem key={group} value={group}>{group}</MenuItem>
    })}
    <MenuItem key={UNCATALOGUED} value={undefined}>{UNCATALOGUED}</MenuItem>
  </Select>
}
