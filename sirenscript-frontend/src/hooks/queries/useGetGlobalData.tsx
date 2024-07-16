import { useQueries } from "@tanstack/react-query";
import { getSuggestions, getSummary, getUpdatedTranscript } from "@/api/api.ts";

export default function useGetGlobalData() {
  useQueries({
    queries: [
      { queryKey: ["callTranscript"], queryFn: getUpdatedTranscript },
      { queryKey: ["callSummary"], queryFn: getSummary },
      // { queryKey: ["callSuggestions"], queryFn: getSuggestions },
    ],
  });
}
