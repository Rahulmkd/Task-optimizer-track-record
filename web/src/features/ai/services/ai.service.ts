import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/redux/axiosBaseQuery";
import { API_PATHS } from "@/constants/api.path";
import { ApiResponse } from "@/types/api.types";
import {
  IJournalPreview,
  IJournalSummary,
  ISaveJournalRequest,
} from "../types/ai.types";

/**
 * RTK Query service for all AI-powered features.
 */
export const aiService = createApi({
  reducerPath: "aiService",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Journal"],

  endpoints: (builder) => ({
    generateJournal: builder.mutation<IJournalPreview, void>({
      query: () => ({
        url: API_PATHS.AI.GENERATE_JOURNAL,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<IJournalPreview>) =>
        response.data,
    }),

    saveJournal: builder.mutation<IJournalSummary, ISaveJournalRequest>({
      query: (body) => ({
        url: API_PATHS.AI.SAVE_JOURNAL,
        method: "POST",
        data: body,
      }),
      transformResponse: (response: ApiResponse<IJournalSummary>) =>
        response.data,
      invalidatesTags: [{ type: "Journal", id: "LIST" }],
    }),

    getJournals: builder.query<IJournalSummary[], void>({
      query: () => ({
        url: API_PATHS.AI.GET_JOURNALS,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<IJournalSummary[]>) =>
        response.data,
      providesTags: [{ type: "Journal", id: "LIST" }],
    }),
  }),
});

export const {
  useGenerateJournalMutation,
  useSaveJournalMutation,
  useGetJournalsQuery,
} = aiService;
