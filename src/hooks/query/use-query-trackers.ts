import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { TrackerService } from "../../services/tracker-service.ts";

/**
 * Custom hook to fetch all trackers.
 * @returns The query result containing the trackers.
 */
export function useQueryTrackers() {
  return useQuery({
    queryKey: QueryKeys.Trackers.All,
    queryFn: TrackerService.list,
  });
}
