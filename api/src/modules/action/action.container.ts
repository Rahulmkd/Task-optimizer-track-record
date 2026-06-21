import { ActionRepository } from "./action.repository.js";
import { ActionService } from "./action.service.js";

const actionRepository = new ActionRepository();
const actionService = new ActionService(actionRepository);

export { actionService };
