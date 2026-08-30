import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/redux/axiosBaseQuery";
import { API_PATHS } from "@/constants/api-paths";
import { ApiResponse } from "@/types/api.types";
import {
  CreateTaskPayload,
  ITask,
  UpdateTaskPayload,
} from "../types/task.types";

export const taskService = createApi({
  reducerPath: "taskService",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Task"],

  endpoints: (builder) => ({
    // ── Create ──────────────────────────────────────────────────────────
    createTask: builder.mutation<ITask, CreateTaskPayload>({
      query: (task) => ({
        url: API_PATHS.TASKS.CREATE,
        method: "POST",
        data: task,
      }),

      transformResponse: (response: ApiResponse<ITask>) => response.data,
      invalidatesTags: ["Task"],
    }),

    // ── Read all ────────────────────────────────────────────────────────
    getTasks: builder.query<ITask[], void>({
      query: () => ({
        url: API_PATHS.TASKS.GET_ALL,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ITask[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((task) => ({ type: "Task" as const, id: task.id })),
              { type: "Task" as const, id: "LIST" },
            ]
          : [{ type: "Task" as const, id: "LIST" }],
    }),

    // ── Read one ────────────────────────────────────────────────────────
    getTaskById: builder.query<ITask, string>({
      query: (id) => ({
        url: API_PATHS.TASKS.GET_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<ITask>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    // ── Update (title / time / actionId) ───────────────────────────────
    updateTask: builder.mutation<
      ITask,
      { id: string; data: UpdateTaskPayload }
    >({
      query: ({ id, data }) => ({
        url: API_PATHS.TASKS.UPDATE(id),
        method: "PATCH",
        data,
      }),
      transformResponse: (response: ApiResponse<ITask>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // ── Toggle completion ───────────────────────────────────────────────
    toggleTask: builder.mutation<ITask, string>({
      query: (id) => ({
        url: API_PATHS.TASKS.TOGGLE(id),
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<ITask>) => response.data,
      // Optimistic update: flip `completed` immediately so the checkbox
      // feels instant, then reconcile with the server response. Roll back
      // on failure.
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          taskService.util.updateQueryData("getTasks", undefined, (draft) => {
            const task = draft.find((t) => t.id === id);
            if (task) task.completed = !task.completed;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // ── Delete ──────────────────────────────────────────────────────────
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: API_PATHS.TASKS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useToggleTaskMutation,
  useDeleteTaskMutation,
} = taskService;
