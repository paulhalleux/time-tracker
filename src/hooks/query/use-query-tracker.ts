import { skipToken, useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { TrackerService } from "../../services/tracker-service.ts";

type UseQueryTrackerParams = {
  id: string | undefined;
};

/**
 * Custom hook to fetch a tracker by its ID.
 *
 * @param {UseQueryTrackerParams} params - The parameters for the query.
 * @param {string} params.id - The ID of the category to fetch.
 * @return The query result containing the category data.
 */
export function useQueryTracker({ id }: UseQueryTrackerParams) {
  return useQuery({
    queryKey: QueryKeys.Trackers.ById(id),
    queryFn: !id ? skipToken : () => TrackerService.read(id),
    enabled: !!id,
  });
}
