import React from "react";
import Drawer from '@mui/material/Drawer';
import { storageContext } from "../contexts";
import { WidthFull } from "@mui/icons-material";
import { Switch, Typography } from "@mui/material";

import { StorageSchema } from "../../utils/types";
import { produce } from "immer";

import themes from "../../utils/themes"


interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 280;
const itemContainerStyle = {
  width: drawerWidth,
  display: "flex",
  // flexDirection: "row",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
}

export default function SettingDrawer(props: DrawerProps) {

  const { storageValue, setStorage } = React.useContext(storageContext);
  const [test, setTest] = React.useState(false);

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
    >
      <div>
        {/* @ts-ignore */}
        <div style={itemContainerStyle}>
          <Typography variant="h6">主题</Typography>
          <Switch checked={test} onChange={(e) => {
            setTest(e.target.checked);
          }} />
        </div>
        {/* @ts-ignore */}
        <div style={itemContainerStyle}>
          <Typography variant="h6">甘特图紧缩模式</Typography>
          <Switch checked={storageValue?.content.mermaidConfig.mermaidInit?.gantt?.displayMode ? true : false} onChange={(e) => {
            setStorage(produce((draft: StorageSchema) => {
              draft.content.mermaidConfig.mermaidInit = draft.content.mermaidConfig.mermaidInit || {};
              draft.content.mermaidConfig.mermaidInit.gantt = draft.content.mermaidConfig.mermaidInit.gantt || {};
              if (e.target.checked) {
                draft.content.mermaidConfig.mermaidInit.gantt.displayMode = "compact";
              }
              else {
                delete draft.content.mermaidConfig.mermaidInit.gantt.displayMode;
              }
            }
            ));
          }} />
        </div>
      </div>
    </Drawer>
  );
}
