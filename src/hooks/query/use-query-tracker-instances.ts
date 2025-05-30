import { skipToken, useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { TrackerInstanceService } from "../../services/tracker-instance-service.ts";

type UseQueryTrackerInstancesParams = {
  trackerId?: string;
};

/**
 * Custom hook to fetch all tracker instances for a given tracker ID.
 * @returns The query result containing the tracker instances.
 */
export function useQueryTrackerInstances({
  trackerId,
}: UseQueryTrackerInstancesParams) {
  return useQuery({
    queryKey: QueryKeys.TrackerInstances.ByTrackerId(trackerId),
    queryFn: !trackerId
      ? skipToken
      : async () => {
          return (await TrackerInstanceService.getByTrackerId(trackerId)).sort(
            (a, b) =>
              new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
          );
        },
    enabled: !!trackerId,
  });
}
