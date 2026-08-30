import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth.slice";
import { taskService } from "@/features/tasks/services/task.service";
import { actionService } from "@/features/actions/services/action.service";
import { aiService } from "@/features/story/services/ai.service";
import { weeklyService } from "@/features/schedule/services/weekly.service";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [actionService.reducerPath]: actionService.reducer,
    [taskService.reducerPath]: taskService.reducer,
    [aiService.reducerPath]: aiService.reducer,
    [weeklyService.reducerPath]: weeklyService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      actionService.middleware,
      taskService.middleware,
      aiService.middleware,
      weeklyService.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
