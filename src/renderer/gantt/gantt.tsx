import React, { useEffect, useRef } from 'react';
import { useInterval } from '../utils/hooks';

import { Paper } from '@mui/material';

import { GroupedTaskType, TaskType } from "../utils/types"
import { OMTFloatWindowConfig } from '../utils/types';

import { parse_gantt } from './parse_gantt';

import mermaid from 'mermaid'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { ensureTaskType } from '../utils/converts';


dayjs.extend(duration)

function GanttGraph(): JSX.Element {

  const mermaidRef = useRef<HTMLDivElement>(null)
  const config = useRef<OMTFloatWindowConfig>({
    mermaidRender: {
      dateFormat: "HH-mm"
    }
  })
  const tasks = useRef<TaskType[] | GroupedTaskType>([])

  useEffect(() => {
    //@ts-ignore
    window.api.getTasks().then((res) => {
      // const loaded = res.map((task: string) => {
      //   return taskTypeLoad(task)
      // })
      console.log(res)
      tasks.current = ensureTaskType(res)
      // renderMermaid(tasks)
    })
  }, [])


  const renderMermaid = (content?: TaskType[]) => {
    // console.log(tasks.current)
    mermaid.render("mermaid", `
gantt
    ${config.current.mermaidRender!.title ?? ""}
    dateFormat ${config.current.mermaidRender!.dateFormat ?? "HH-mm"}
    ${parse_gantt(content??tasks.current, config.current.mermaidRender!.dateFormat ?? "HH-mm")}
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

  // 分钟，秒
  const [currentTime, setCurrentTime] = React.useState(dayjs().format("HH-mm"))

  useInterval(() => {
    renderMermaid()
  }, 2000)

  useInterval(() => {
    setCurrentTime(dayjs().format("HH:mm:ss"))
  }, 500)


  return <Paper elevation={1} sx={{ width: "100%", height: "100vh" }}>
    <div ref={mermaidRef} id="mermaid_target"></div>
    {/* {currentTime} */}
  </Paper>
}

export default GanttGraph
