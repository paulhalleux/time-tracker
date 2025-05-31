import { useMutation } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { TrackerService } from "../../services/tracker-service.ts";
import type { CreateTrackerDto } from "../../types/tracker.ts";

type UseUpdateTrackerArgs = {
  id: string;
  tracker: CreateTrackerDto;
};

/**
 * Custom hook to update an existing tracker.
 */
export function useUpdateTracker() {
  return useMutation({
    mutationFn: async ({ id, tracker }: UseUpdateTrackerArgs) => {
      await TrackerService.update(id, tracker);
    },
    meta: {
      refreshQueries: (data) => [
        {
          queryKey: QueryKeys.Trackers.All,
        },
        {
          queryKey: QueryKeys.Trackers.ById((data as UseUpdateTrackerArgs).id),
        },
      ],
    },
  });
}
