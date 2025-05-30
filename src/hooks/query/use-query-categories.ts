import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "../../constants/query-keys.ts";
import { CategoryService } from "../../services/category-service.ts";

/**
 * Custom hook to fetch all tracker categories.
 *
 * @returns The query result containing the categories.
 */
export function useQueryCategories() {
  return useQuery({
    queryKey: QueryKeys.Categories.All,
    queryFn: CategoryService.list,
  });
}
