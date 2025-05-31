import { useMutation } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { TrackerService } from "../../services/tracker-service.ts";
import type { CreateTrackerDto } from "../../types/tracker.ts";

type UseCreateTrackerArgs = {
  tracker: CreateTrackerDto;
};

/**
 * Custom hook to create a new tracker.
 */
export function useCreateTracker() {
  return useMutation({
    mutationFn: async ({ tracker }: UseCreateTrackerArgs) => {
      return await TrackerService.create(tracker);
    },
    meta: {
      refreshQueries: {
        queryKey: QueryKeys.Trackers.All,
      },
    },
  });
}
