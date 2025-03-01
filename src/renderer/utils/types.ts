// TODO: 将 any 替换为具体的类型
import { Duration } from "dayjs/plugin/duration"
import { MermaidConfig } from "mermaid"

export interface AlertType {
  time: any,
  alert_type: "notification" | "alarm" | "uuid",
}

export type repeatType = undefined | "weekly"

export interface TaskType {
  id: number,
  // abstract: string,
  content: string,
  status: "on going" | "done" | "postponed" | "canceled",
  ddl: any,
  duration: Duration | undefined,
  alerts: AlertType[],
  predecessors?: string[] | undefined,
  repeat?: repeatType,
  group: string | undefined,
}

export interface OMTFloatWindowConfig {
  mermaidInit?: MermaidConfig
  mermaidRender?: {
    title?: string
    dateFormat?: string
  }
}

export interface GroupedTaskType {
  [key: string]: TaskType[]
}

export interface StorageSchema {
  content: {
    tasks: TaskType[],
    groups: string[],
    mermaidConfig: OMTFloatWindowConfig
  }
}

export const defaultTask: TaskType = {
  id: 0,
  content: "",
  status: "on going",
  ddl: undefined,
  duration: undefined,
  alerts: [],
  group: undefined,
}

export const defaultStorage: StorageSchema = {
  content: {
    tasks: [],
    groups: [],
    mermaidConfig: {}
  },
}

export type sortType = "all" | "incomplete" | "today"
