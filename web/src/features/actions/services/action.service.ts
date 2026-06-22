import { axiosBaseQuery } from "@/redux/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
import {
  CreateActionPayload,
  IAction,
  UpdateActionPayload,
} from "../types/action.types";
import { API_PATHS } from "@/constants/api.path";
import { ApiResponse } from "@/types/api.types";

export const actionService = createApi({
  reducerPath: "actionService",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Action"],

  endpoints: (builder) => ({
    // ── Create ──────────────────────────────────────────────────────────
    createAction: builder.mutation<IAction, CreateActionPayload>({
      query: (action) => ({
        url: API_PATHS.ACTIONS.CREATE,
        method: "POST",
        data: action,
      }),
      transformResponse: (response: ApiResponse<IAction>) => response.data,
      invalidatesTags: [{ type: "Action", id: "LIST" }],
    }),

    // ── Read all ────────────────────────────────────────────────────────
    getActions: builder.query<IAction[], void>({
      query: () => ({
        url: API_PATHS.ACTIONS.GET_ALL,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IAction[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((action) => ({
                type: "Action" as const,
                id: action.id,
              })),
              { type: "Action" as const, id: "LIST" },
            ]
          : [{ type: "Action" as const, id: "LIST" }],
    }),

    // ── Read one ────────────────────────────────────────────────────────
    getActionById: builder.query<IAction, string>({
      query: (id) => ({
        url: API_PATHS.ACTIONS.GET_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IAction>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Action", id }],
    }),

    // ── Update ──────────────────────────────────────────────────────────
    updateAction: builder.mutation<
      IAction,
      { id: string; data: UpdateActionPayload }
    >({
      query: ({ id, data }) => ({
        url: API_PATHS.ACTIONS.UPDATE(id),
        method: "PATCH",
        data,
      }),
      transformResponse: (response: ApiResponse<IAction>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Action", id },
        { type: "Action", id: "LIST" },
      ],
    }),

    // ── Delete ──────────────────────────────────────────────────────────
    deleteAction: builder.mutation<void, string>({
      query: (id) => ({
        url: API_PATHS.ACTIONS.DELETE(id),
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Action", id },
        { type: "Action", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateActionMutation,
  useGetActionsQuery,
  useGetActionByIdQuery,
  useUpdateActionMutation,
  useDeleteActionMutation,
} = actionService;
