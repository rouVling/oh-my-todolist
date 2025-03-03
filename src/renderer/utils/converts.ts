import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
dayjs.extend(duration)

import { TaskType } from "./types"

export function taskTypeDump(task: TaskType): string {
  return JSON.stringify(task)
  // return JSON.stringify({
  //   ...task,
  //   ddl: task.ddl?.toJSON(),
  //   duration: task.duration?.toJSON(),
  //   alerts: task.alerts.map((alert) => ({
  //     ...alert,
  //     time: alert.time.toJSON()
  //   }))
  // })
}

// export function taskTypeLoad(task: string): TaskType {
//   const taskObj = JSON.parse(task)
//   return {
//     ...taskObj,
//     ddl: taskObj.ddl ? dayjs(taskObj.ddl) : undefined,
//     duration: taskObj.duration ? dayjs.duration(taskObj.duration) : undefined,
//     alerts: taskObj.alerts.map((alert: any) => ({
//       ...alert,
//       time: dayjs(alert.time)
//     }))
//   }
// }

// export function dayjsDump(date: dayjs.Dayjs): string {
//   return date.toJSON()
// }

export function dayjsLoad(date: string): dayjs.Dayjs {
  return dayjs(date)
}

export function durationDump(duration): string {
  return duration.toJSON()
}

export function durationLoad(duration: string) {
  return dayjs.duration(duration)
}

export function taskTypePartialDump(task: TaskType) {
  return {
    ...task,
    ddl: task.ddl? ensureDayjsString(task.ddl): undefined,
    start: task.start? ensureDayjsString(task.start): undefined,
    duration: task.duration? task.duration.toJSON(): undefined,
    alerts: task.alerts?.map((alert) => ({
      ...alert,
      time: ensureDayjsString(alert.time)
    }))
  }
}

export function ensureDayjs(date: any): dayjs.Dayjs {
  // return dayjs(date)
  console.log(date)
  if (typeof date === "string") {
    return dayjs(date)
  }
  return date
}

export function ensureDayjsString(date: any): string {
  return typeof date === "string" ? date : date.toJSON()
}

export function ensureDuration(duration: any) {
  return dayjs.duration(duration)
}

export function taskTypePartialLoad(task: any): TaskType {
  console.log(task)
  return {
    ...task,
    // ddl: task.ddl ? dayjs(task.ddl) : undefined,
    ddl: task.ddl ? ensureDayjs(task.ddl) : undefined,
    start: task.start? ensureDayjs(task.start): undefined,
    duration: task.duration ? dayjs.duration(task.duration) : undefined,
    alerts: task.alerts.map((alert: any) => ({
      ...alert,
      time: ensureDayjs(alert.time)
    }))
  }
}

export function ensureTaskType(task: any): TaskType[] {
  return task.map(taskTypePartialLoad)
}
