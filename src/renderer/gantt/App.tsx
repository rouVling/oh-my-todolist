import React from 'react';

import { ThemeProvider } from '@mui/material';
import { darkTheme, primaryTheme } from '../utils/themes';

import GanttGraph from './gantt';

function GanttApp(): JSX.Element {

  return <ThemeProvider theme={primaryTheme}>
    <GanttGraph />
  </ThemeProvider>
}

export default GanttApp
