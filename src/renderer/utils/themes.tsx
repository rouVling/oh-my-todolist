import * as React from 'react';
import { createTheme } from "@mui/material";
import { create } from "domain";
import Checkbox from '@mui/material/Checkbox';
import { blue, green, brown, grey } from '@mui/material/colors';
import { zhCN } from '@mui/material/locale';

interface AdditionalOptions {
  taskStatus: {
    going: string,
    done: string,
    postponed: string,
    canceled: string,
  }
}

const defaultAdditionalOptions: AdditionalOptions = {
  taskStatus: {
    going: blue[500],
    done: green[500],
    postponed: brown[500],
    canceled: grey[500]
  },
}

export const primaryTheme = createTheme({
  ...defaultAdditionalOptions,
  palette: {},
  //@ts-ignore
  // light: '#42a5f5',
  // dark: '#1565c0',
  // contrastText: '#fff',
}, zhCN);

export const darkTheme = createTheme({
  ...defaultAdditionalOptions,
  palette: {
    mode: 'dark',
  },
}, zhCN);

const themes = { primaryTheme, darkTheme };

export default themes;
