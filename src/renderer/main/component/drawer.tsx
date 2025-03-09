import React from "react";
import Drawer from '@mui/material/Drawer';
import { storageContext } from "../contexts";
import { WidthFull } from "@mui/icons-material";
import { Input, MenuItem, Select, Switch, Typography } from "@mui/material";

import { StorageSchema } from "../../utils/types";
import { produce } from "immer";

import themes from "../../utils/themes"

import { setThemeContext } from "../contexts";

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

  const setTheme = React.useContext(setThemeContext);

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
    >
      <div>
        {/* @ts-ignore */}
        <div style={itemContainerStyle}>
          {/* <Typography variant="body">主题</Typography> */}
          <Typography>主题</Typography>
          <Select variant="standard" value={storageValue?.content.settings?.theme} onChange={(e) => {
            setStorage(produce((draft: StorageSchema) => {
              // @ts-ignore
              draft.content.settings.theme = e.target.value;
              setTheme(themes[e.target.value]);
            }));
          }}>
            {Object.keys(themes).map((theme) => {
              return <MenuItem key={theme} value={theme}>{theme}</MenuItem>
            })}
          </Select>
          {/* <Switch checked={test} onChange={(e) => {
            setTest(e.target.checked);
          }} /> */}
        </div>
        {/* @ts-ignore */}
        <div style={itemContainerStyle}>
          <Typography>甘特图紧缩模式</Typography>
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

        {/* @ts-ignore */}
        <div style={itemContainerStyle}>
          <Typography>近期指</Typography>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Input type="number" sx={{ width: "4em" }} value={storageValue?.content.settings?.recentDay} onChange={(e) => {
              setStorage(produce((draft: StorageSchema) => {
                draft.content.settings.recentDay = parseInt(e.target.value);
              }));
            }
            } />
            <Typography>天内</Typography>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
