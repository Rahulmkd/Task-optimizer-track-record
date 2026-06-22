import { ActionRepository } from "../action/action.repository.js";
import { TaskRepository } from "./task.repository.js";
import { TaskService } from "./task.service.js";

const taskRepository = new TaskRepository();

const actionRepository = new ActionRepository();
const taskService = new TaskService(taskRepository, actionRepository);

export { taskService };
