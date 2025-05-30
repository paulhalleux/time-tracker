import { useMutation } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { TrackerService } from "../../services/tracker-service.ts";

type UseDeleteTrackerArgs = {
  id: string;
};

/**
 * Custom hook to delete a category by its ID.
 */
export function useDeleteTracker() {
  return useMutation({
    mutationFn: async ({ id }: UseDeleteTrackerArgs) => {
      await TrackerService.delete(id);
    },
    meta: {
      refreshQueries: {
        queryKey: QueryKeys.Trackers.All,
      },
    },
  });
}
