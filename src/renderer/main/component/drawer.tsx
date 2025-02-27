import React from "react";
import Drawer from '@mui/material/Drawer';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingDrawer(props: DrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
    >
      <div>
        <p>Drawer content</p>
      </div>
    </Drawer>
  );
}
