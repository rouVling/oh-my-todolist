import { GroupedTag } from "styled-components/dist/sheet/types";
import { GroupedTaskType, TaskType } from "../utils/types";

export const parse_gantt = (tasks: TaskType[] | GroupedTaskType, timeFormat) => {
  let gantt = ""

  // judge if tasks is a GroupedTaskType
  if (Array.isArray(tasks)) {
    tasks = {
      "default": tasks
    }
  }
  
  // tasks.forEach(element => {
  //   // gantt += `section ${element.content}\n`
  //   console.log(element.ddl)
  //   gantt += `${element.content} : ${element.ddl.format(timeFormat)}, ${element.ddl.add(element.duration).format(timeFormat)}\n`
  // });

  for (const key in (tasks as GroupedTaskType)) {
    gantt += `section ${key}\n`
    for (const task of tasks[key]) {
      gantt += `${task.content} : ${task.ddl.format(timeFormat)}, ${task.ddl.add(task.duration).format(timeFormat)}\n`
    }
  }

  // console.log(gantt)
  return gantt
}
