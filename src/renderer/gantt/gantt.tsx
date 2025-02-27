import React, { useEffect, useRef } from 'react';
import { useInterval } from '../utils/hooks';

import { Paper } from '@mui/material';

import { GroupedTaskType, TaskType } from "../utils/types"
import { OMTFloatWindowConfig } from '../utils/types';

import { parse_gantt } from './parse_gantt';

import mermaid from 'mermaid'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'


dayjs.extend(duration)

function GanttGraph(): JSX.Element {

  const mermaidRef = useRef<HTMLDivElement>(null)
  const config = useRef<OMTFloatWindowConfig>({
    mermaidRender: {
      dateFormat: "HH-mm"
    }
  })
  const tasks = useRef<TaskType[] | GroupedTaskType>([
    {
      id: "1",
      content: "TODO 主界面",
      status: "on going",
      ddl: dayjs("2025-02-27T20:00:00"),
      duration: dayjs.duration(1, "hour"),
      alerts: [],
    },
    {
      id: "2",
      content: "overwatch",
      status: "on going",
      ddl: dayjs("2025-02-27T20:00:00"),
      // duration: undefined,
      duration: dayjs.duration(1, "hour"),
      alerts: [],
    },
  ])


  const renderMermaid = () => {
    mermaid.render("mermaid", `
gantt
    ${config.current.mermaidRender!.title ?? ""}
    dateFormat ${config.current.mermaidRender!.dateFormat ?? "HH-mm"}
    ${parse_gantt(tasks.current, config.current.mermaidRender!.dateFormat ?? "HH-mm")}
`
    ).then(({ svg }) => {
      mermaidRef.current!.innerHTML = svg
    })
  }


  useEffect(() => {
    mermaid.initialize(
      {
        ...config.current.mermaidInit,

        startOnLoad: false,
        securityLevel: "loose",
        gantt: {
          axisFormat: "%H:%M",
          tickInterval: "30minute"
        }
      })
    mermaid.render("mermaid", "graph LR")
    console.log("mermaid init")
  }, [config])

  useInterval(() => {
    renderMermaid()
  }, 2000)

  return <Paper elevation={1} sx={{ width: "100%", height: "100vh" }}>
    <div ref={mermaidRef} id="mermaid_target"></div>
  </Paper>
}

export default GanttGraph
