import { Task } from "@prisma/client";

export class TaskFormatter {
  static format(tasks: Task[]) {
    if (!tasks.length) {
      return "No tasks available today.";
    }

    return tasks
      .map((task, index) => {
        return `
Task ${index + 1}
Title : ${task.title}
Completed : ${task.completed ? "Yes" : "No"}
Time : ${task.time ?? "Not Specified"}
`;
      })
      .join("\n");
  }
}
