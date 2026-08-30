import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/redux/axiosBaseQuery";
import { API_PATHS } from "@/constants/api-paths";
import { ApiResponse } from "@/types/api.types";
import {
  CreateWeeklyTaskPayload,
  IWeeklyPlan,
  IWeeklyTask,
  UpdateWeeklyTaskPayload,
} from "../types/weekly.types";

/**
 * RTK Query service for the Weekly Planner module.
 */
export const weeklyService = createApi({
  reducerPath: "weeklyService",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["WeeklyPlan"],

  endpoints: (builder) => ({
    getWeeklyPlan: builder.query<IWeeklyPlan, string>({
      query: (weekStart) => ({
        url: `${API_PATHS.WEEKLY.GET_PLAN}?weekStart=${weekStart}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IWeeklyPlan>) => response.data,
      providesTags: (_result, _error, weekStart) => [
        { type: "WeeklyPlan", id: weekStart },
      ],
    }),

    createWeeklyTask: builder.mutation<IWeeklyTask, CreateWeeklyTaskPayload>({
      query: (data) => ({
        url: API_PATHS.WEEKLY.CREATE_TASK,
        method: "POST",
        data,
      }),
      transformResponse: (response: ApiResponse<IWeeklyTask>) => response.data,
      invalidatesTags: (_result, _error, arg) => [
        { type: "WeeklyPlan", id: arg.weekStart },
      ],
    }),

    updateWeeklyTask: builder.mutation<
      IWeeklyTask,
      { id: string; weekStart: string; data: UpdateWeeklyTaskPayload }
    >({
      query: ({ id, data }) => ({
        url: API_PATHS.WEEKLY.UPDATE_TASK(id),
        method: "PATCH",
        data,
      }),
      transformResponse: (response: ApiResponse<IWeeklyTask>) => response.data,
      invalidatesTags: (_result, _error, { weekStart }) => [
        { type: "WeeklyPlan", id: weekStart },
      ],
    }),

    toggleWeeklyTask: builder.mutation<
      IWeeklyTask,
      { id: string; weekStart: string }
    >({
      query: ({ id }) => ({
        url: API_PATHS.WEEKLY.TOGGLE_TASK(id),
        method: "PATCH",
      }),
      transformResponse: (response: ApiResponse<IWeeklyTask>) => response.data,
      // Optimistic update — flip completed immediately; roll back on error.
      async onQueryStarted({ id, weekStart }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          weeklyService.util.updateQueryData(
            "getWeeklyPlan",
            weekStart,
            (draft) => {
              const task = draft.tasks.find((t) => t.id === id);
              if (task) {
                task.completed = !task.completed;
                draft.stats.completed = draft.tasks.filter(
                  (t) => t.completed,
                ).length;
                draft.stats.pending = draft.stats.total - draft.stats.completed;
                draft.stats.progressPercent =
                  draft.stats.total === 0
                    ? 0
                    : Math.round(
                        (draft.stats.completed / draft.stats.total) * 100,
                      );
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: (_result, _error, { weekStart }) => [
        { type: "WeeklyPlan", id: weekStart },
      ],
    }),

    deleteWeeklyTask: builder.mutation<void, { id: string; weekStart: string }>(
      {
        query: ({ id }) => ({
          url: API_PATHS.WEEKLY.DELETE_TASK(id),
          method: "DELETE",
        }),
        invalidatesTags: (_result, _error, { weekStart }) => [
          { type: "WeeklyPlan", id: weekStart },
        ],
      },
    ),
  }),
});

export const {
  useGetWeeklyPlanQuery,
  useCreateWeeklyTaskMutation,
  useUpdateWeeklyTaskMutation,
  useToggleWeeklyTaskMutation,
  useDeleteWeeklyTaskMutation,
} = weeklyService;
