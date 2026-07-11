import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/redux/axiosBaseQuery";
import { API_PATHS } from "@/constants/api.path";
import { ApiResponse } from "@/types/api.types";
import { IJournalSummary } from "../types/ai.types";

/**
 * RTK Query service for AI-powered features.
 */
export const aiService = createApi({
  reducerPath: "aiService",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    generateJournal: builder.mutation<IJournalSummary, void>({
      query: () => ({
        url: API_PATHS.AI.GENERATE_JOURNAL,
        method: "POST",
      }),
      transformResponse: (response: ApiResponse<IJournalSummary>) =>
        response.data,
    }),
  }),
});

export const { useGenerateJournalMutation } = aiService;
