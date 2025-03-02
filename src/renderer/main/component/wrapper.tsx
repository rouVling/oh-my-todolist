import React, { useEffect } from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ListIcon from '@mui/icons-material/List';
import { Input } from "@mui/material";

import { storageContext } from "../contexts";
import { produce } from "immer";

import { UNCATALOGUED } from "../../utils/constants";

const drawerWidth = 180;

const upperList = [
  {
    text: "今日",
    icon: <WbSunnyIcon />
  },
  {
    text: "总览",
    icon: <ChecklistIcon />
  },
  {
    text: "未完成",
    icon: <ListIcon />
  }
]

interface Props {
  children: React.ReactNode;
  clickTab: any,
  clickGroup: any,
  toggleSettingDrawerOpen: any,
}

export default function Wrapper(props: Props) {

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const [highlightGroupName, setHighlightGroupName] = React.useState<"upper" | "lower">("upper");
  const [highlightGroupIndex, setHighlightGroupIndex] = React.useState(0);

  const [newGroupName, setNewGroupName] = React.useState("");
  const { storageValue, setStorage } = React.useContext(storageContext);

  useEffect(() => {
    // storageValue.content?.tasks[2].ddl? console.log("in wrapper", storageValue.content.tasks[2].ddl): ""
    console.log("in wrapper", storageValue.content)
  })

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      {/* <Toolbar>
        <IconButton
          color="inherit"
          aria-label="close drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ mr: 2}}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar> */}
      <Divider />
      <List>
        {upperList.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => {
              setHighlightGroupName("upper");
              setHighlightGroupIndex(index);
              props.clickTab(index)
            }}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {[...storageValue.content.groups, UNCATALOGUED].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => {
              setHighlightGroupName("lower");
              setHighlightGroupIndex(index);
              props.clickGroup(index)
            }}>
              {/* <ListItemIcon> */}
              {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              {/* </ListItemIcon> */}
              <ListItemText primary={text} />
            </ListItemButton>
            {text === UNCATALOGUED ? null :
              <IconButton onClick={() => {
                setStorage(produce((draft: any) => {
                  draft.content.groups = draft.content.groups.filter((_, i) => i !== index);
                  draft.content.tasks = draft.content.tasks.filter((task: any) => task.group !== text);
                  // .map((task: any) => {
                  //   if (task.group === text) {
                  //     task.group = UNCATALOGUED;
                  //   }
                  //   return task;
                  // });
                }
                ));
              }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            }
          </ListItem>
        ))}
        <ListItem key="add" >
          {/* <ListItemButton> */}
          <Input placeholder="添加分类" value={newGroupName} onChange={(e) => {
            setNewGroupName(e.target.value);
          }} onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (newGroupName === "") {
                return;
              }
              if (storageValue.content.groups.includes(newGroupName)) {
                return;
              }
              setStorage(produce((draft: any) => {
                draft.content.groups.push(newGroupName);
                setNewGroupName("");
              }
              ));
            }
          }} />
          <IconButton onClick={() => {
            setStorage(produce((draft: any) => {
              if (newGroupName === "") {
                return;
              }
              if (storageValue.content.groups.includes(newGroupName)) {
                return;
              }
              draft.content.groups.push(newGroupName);
              setNewGroupName("");
            }
            ));
          }}>
            <AddIcon />
          </IconButton>
          {/* <ListItemText primary="添加分类" /> */}
          {/* </ListItemButton> */}
        </ListItem>
      </List>
    </div>
  );

  return <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            // sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {highlightGroupName === "upper" ? upperList[highlightGroupIndex].text : "分类：" + storageValue.content.groups[highlightGroupIndex]}
            </Typography>
          </div>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={props.toggleSettingDrawerOpen}
            sx={{ ml: 'auto' }}
          >
            <SettingsIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      // slotProps={{
      //   root: {
      //     keepMounted: true, // Better open performance on mobile.
      //   },
      // }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar />
      {props.children}
    </Box>
  </Box>
}
