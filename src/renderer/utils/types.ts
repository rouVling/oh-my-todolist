// TODO: 将 any 替换为具体的类型
import { Duration } from "dayjs/plugin/duration"
import { MermaidConfig } from "mermaid"

export interface AlertType {
  time: any,
  alert_type: "notification" | "alarm" | "uuid",
}

export type repeatType = undefined | "weekly"

export interface TaskType {
  id: string,
  // abstract: string,
  content: string,
  status: "on going" | "done" | "finished" | "postponed" | "canceled",
  ddl: any,
  duration: Duration | undefined,
  alerts: AlertType[],
  predecessors?: string[] | undefined,
  repeat?: repeatType,
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
